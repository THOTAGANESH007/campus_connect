import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../models/drive_model.dart';
import '../../theme.dart';

class CreateDriveScreen extends StatefulWidget {
  final DriveModel? existingDrive;
  const CreateDriveScreen({super.key, this.existingDrive});

  @override
  State<CreateDriveScreen> createState() => _CreateDriveScreenState();
}

class _CreateDriveScreenState extends State<CreateDriveScreen> {
  final _formKey = GlobalKey<FormState>();
  final _companyCtrl = TextEditingController();
  final _roleCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _packageCtrl = TextEditingController();
  final _gpaCtrl = TextEditingController();
  final _regLinkCtrl = TextEditingController();
  String _jobType = 'FULL_TIME';
  DateTime? _deadline;
  List<String> _branches = [];
  bool _loading = false;

  final List<String> _jobTypes = ['FULL_TIME', 'INTERNSHIP', 'CONTRACT'];
  final List<String> _allBranches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];

  bool get _isEditing => widget.existingDrive != null;

  @override
  void initState() {
    super.initState();
    if (_isEditing) {
      final d = widget.existingDrive!;
      _companyCtrl.text = d.company;
      _roleCtrl.text = d.role;
      _descCtrl.text = d.description ?? '';
      _packageCtrl.text = d.package?.toString() ?? '';
      _gpaCtrl.text = d.minGpa?.toString() ?? '';
      _regLinkCtrl.text = d.registrationLink ?? '';
      _jobType = d.jobType ?? 'FULL_TIME';
      _deadline = d.deadline;
      _branches = d.eligibleBranches ?? [];
    }
  }

  @override
  void dispose() {
    _companyCtrl.dispose();
    _roleCtrl.dispose();
    _descCtrl.dispose();
    _packageCtrl.dispose();
    _gpaCtrl.dispose();
    _regLinkCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    final body = {
      'company': _companyCtrl.text.trim(),
      'role': _roleCtrl.text.trim(),
      'description': _descCtrl.text.trim(),
      'jobType': _jobType,
      if (_packageCtrl.text.isNotEmpty)
        'package': double.tryParse(_packageCtrl.text),
      if (_gpaCtrl.text.isNotEmpty) 'minGpa': double.tryParse(_gpaCtrl.text),
      if (_deadline != null) 'deadline': _deadline!.toIso8601String(),
      if (_branches.isNotEmpty) 'eligibleBranches': _branches,
      if (_regLinkCtrl.text.isNotEmpty)
        'registrationLink': _regLinkCtrl.text.trim(),
    };
    try {
      if (_isEditing) {
        await ApiService.instance
            .updateDrive(widget.existingDrive!.id, body);
      } else {
        await ApiService.instance.createDrive(body);
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Drive ${_isEditing ? 'updated' : 'created'} successfully!'),
          backgroundColor: AppTheme.success,
          behavior: SnackBarBehavior.floating,
        ));
        Navigator.pop(context);
      }
    } catch (e) {
      final data = (e as dynamic).response?.data;
      final msg = data is Map ? data['message'] ?? 'Error' : 'Error';
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text(msg),
          backgroundColor: AppTheme.error,
          behavior: SnackBarBehavior.floating,
        ));
      }
    }
    setState(() => _loading = false);
  }

  Future<void> _pickDeadline() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _deadline ?? DateTime.now().add(const Duration(days: 7)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.dark(primary: AppTheme.primary),
        ),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _deadline = picked);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text(_isEditing ? 'Edit Drive' : 'Create Drive')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              _field(_companyCtrl, 'Company Name', Icons.business_outlined,
                  required: true),
              const SizedBox(height: 14),
              _field(_roleCtrl, 'Role / Position', Icons.work_outline,
                  required: true),
              const SizedBox(height: 14),
              _field(_descCtrl, 'Job Description', Icons.description_outlined,
                  maxLines: 4),
              const SizedBox(height: 14),
              DropdownButtonFormField<String>(
                value: _jobType,
                decoration: const InputDecoration(
                    labelText: 'Job Type',
                    prefixIcon: Icon(Icons.category_outlined)),
                dropdownColor: AppTheme.bgCard,
                items: _jobTypes
                    .map((jt) => DropdownMenuItem(
                        value: jt,
                        child: Text(jt.replaceAll('_', ' '),
                            style:
                                const TextStyle(color: AppTheme.textPrimary))))
                    .toList(),
                onChanged: (v) => setState(() => _jobType = v!),
              ),
              const SizedBox(height: 14),
              _field(_packageCtrl, 'Package (LPA)', Icons.currency_rupee_rounded,
                  keyboard: TextInputType.number),
              const SizedBox(height: 14),
              _field(_gpaCtrl, 'Minimum GPA', Icons.grade_outlined,
                  keyboard: TextInputType.number),
              const SizedBox(height: 14),
              _field(_regLinkCtrl, 'Registration Link (optional)',
                  Icons.link_rounded),
              const SizedBox(height: 14),

              // Deadline
              InkWell(
                onTap: _pickDeadline,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 16),
                  decoration: BoxDecoration(
                    color: AppTheme.bgSurface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.bgBorder),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today_outlined,
                          color: AppTheme.textSecondary),
                      const SizedBox(width: 12),
                      Text(
                        _deadline != null
                            ? 'Deadline: ${_deadline!.day}/${_deadline!.month}/${_deadline!.year}'
                            : 'Pick Application Deadline',
                        style: TextStyle(
                          color: _deadline != null
                              ? AppTheme.textPrimary
                              : AppTheme.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 14),

              // Branch selection
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.bgSurface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.bgBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Eligible Branches',
                        style: TextStyle(color: AppTheme.textSecondary)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 6,
                      children: _allBranches.map((b) {
                        final selected = _branches.contains(b);
                        return FilterChip(
                          label: Text(b),
                          selected: selected,
                          onSelected: (v) {
                            setState(() {
                              if (v) {
                                _branches.add(b);
                              } else {
                                _branches.remove(b);
                              }
                            });
                          },
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _loading ? null : _submit,
                child: _loading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.white))
                    : Text(_isEditing ? 'Update Drive' : 'Create Drive'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _field(TextEditingController ctrl, String label, IconData icon,
      {bool required = false,
      int maxLines = 1,
      TextInputType keyboard = TextInputType.text}) {
    return TextFormField(
      controller: ctrl,
      maxLines: maxLines,
      keyboardType: keyboard,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: maxLines == 1 ? Icon(icon) : null,
      ),
      validator: required
          ? (v) => v == null || v.isEmpty ? 'Required' : null
          : null,
    );
  }
}
