import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:file_picker/file_picker.dart';
import 'package:dio/dio.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../../theme.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _loading = true;
  String? _error;
  bool _uploadingResume = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() => _loading = true);
    try {
      // refreshUser calls /api/profile/me and updates the UserModel
      // The UserModel now contains all fields: phone, cgpa, skills, resume, branch
      await context.read<AuthProvider>().refreshUser();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    setState(() => _loading = false);
  }

  Future<void> _uploadResume() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );
    if (result == null || result.files.first.path == null) return;
    setState(() => _uploadingResume = true);
    try {
      final formData = FormData.fromMap({
        'resume': await MultipartFile.fromFile(
          result.files.first.path!,
          filename: result.files.first.name,
        ),
      });
      await ApiService.instance.uploadResume(formData);
      if (!mounted) return;
      await context.read<AuthProvider>().refreshUser();
      _loadProfile();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Resume uploaded successfully!'),
          backgroundColor: AppTheme.success,
          behavior: SnackBarBehavior.floating,
        ));
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Upload failed'),
          backgroundColor: AppTheme.error,
          behavior: SnackBarBehavior.floating,
        ));
      }
    }
    setState(() => _uploadingResume = false);
  }

  void _showEditDialog() {
    final user = context.read<AuthProvider>().user;
    final nameCtrl = TextEditingController(text: user?.name);
    final phoneCtrl = TextEditingController(text: user?.phone ?? '');
    final skillsCtrl = TextEditingController(
        text: (user?.skills ?? []).join(', '));
    final cgpaCtrl = TextEditingController(
        text: user?.cgpa?.toString() ?? '');
    String branch = user?.branch ?? '';
    const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML'];
    bool saving = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.bgCard,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx2, sb) => Padding(
          padding: EdgeInsets.only(
              left: 16,
              right: 16,
              top: 20,
              bottom: MediaQuery.of(ctx2).viewInsets.bottom + 24),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Edit Profile',
                        style: Theme.of(ctx2).textTheme.titleLarge),
                    Container(
                      width: 36,
                      height: 4,
                      decoration: BoxDecoration(
                          color: AppTheme.bgBorder,
                          borderRadius: BorderRadius.circular(2)),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                // Name
                TextField(
                    controller: nameCtrl,
                    decoration: const InputDecoration(
                        labelText: 'Full Name',
                        prefixIcon: Icon(Icons.person_outline))),
                const SizedBox(height: 12),
                // Phone
                TextField(
                    controller: phoneCtrl,
                    keyboardType: TextInputType.phone,
                    decoration: const InputDecoration(
                        labelText: 'Phone Number',
                        prefixIcon: Icon(Icons.phone_outlined))),
                const SizedBox(height: 12),
                // CGPA
                TextField(
                    controller: cgpaCtrl,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    decoration: const InputDecoration(
                        labelText: 'CGPA (0 – 10)',
                        prefixIcon: Icon(Icons.grade_outlined))),
                const SizedBox(height: 12),
                // Branch dropdown
                DropdownButtonFormField<String>(
                  value: branch.isNotEmpty && branches.contains(branch)
                      ? branch
                      : null,
                  dropdownColor: AppTheme.bgCard,
                  decoration: const InputDecoration(
                      labelText: 'Branch',
                      prefixIcon: Icon(Icons.school_outlined)),
                  items: branches
                      .map((b) => DropdownMenuItem(
                          value: b,
                          child: Text(b,
                              style: const TextStyle(
                                  color: AppTheme.textPrimary))))
                      .toList(),
                  onChanged: (v) => sb(() => branch = v ?? ''),
                ),
                const SizedBox(height: 12),
                // Skills
                TextField(
                    controller: skillsCtrl,
                    decoration: const InputDecoration(
                        labelText: 'Skills (comma-separated)',
                        prefixIcon: Icon(Icons.code_rounded))),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: saving
                      ? null
                      : () async {
                          sb(() => saving = true);
                          final authProv = context.read<AuthProvider>();
                          final skills = skillsCtrl.text
                              .split(',')
                              .map((s) => s.trim())
                              .where((s) => s.isNotEmpty)
                              .toList();
                          try {
                            // /api/profile/update handles name, phone, cgpa, branch, skills
                            await ApiService.instance.updateProfile({
                              if (nameCtrl.text.trim().isNotEmpty)
                                'name': nameCtrl.text.trim(),
                              if (phoneCtrl.text.trim().isNotEmpty)
                                'phone': phoneCtrl.text.trim(),
                              'skills': skills,
                              if (cgpaCtrl.text.isNotEmpty)
                                'cgpa': double.tryParse(cgpaCtrl.text),
                              if (branch.isNotEmpty) 'branch': branch,
                            });
                            await authProv.refreshUser();
                            if (ctx2.mounted) Navigator.pop(ctx2);
                            _loadProfile();
                          } catch (_) {
                            sb(() => saving = false);
                          }
                        },
                  child: saving
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white))
                      : const Text('Save Changes'),
                ),
                const SizedBox(height: 8),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ── Build ──────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        automaticallyImplyLeading: false,
        leading: IconButton(
          icon: const Icon(Icons.menu_rounded),
          onPressed: () => context
              .read<GlobalKey<ScaffoldState>>()
              .currentState
              ?.openDrawer(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined),
            onPressed: _showEditDialog,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline,
                        color: AppTheme.error, size: 48),
                    TextButton(
                        onPressed: _loadProfile, child: const Text('Retry')),
                  ],
                ))
              : RefreshIndicator(
                  onRefresh: _loadProfile,
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        // ── Avatar card ──────────────────────────────
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF1E1B4B), AppTheme.bgCard],
                            ),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppTheme.bgBorder),
                          ),
                          child: Column(
                            children: [
                              CircleAvatar(
                                radius: 44,
                                backgroundColor:
                                    AppTheme.primary.withValues(alpha: 0.2),
                                backgroundImage: user?.profilePic != null
                                    ? NetworkImage(user!.profilePic!)
                                    : null,
                                child: user?.profilePic == null
                                    ? Text(
                                        (user?.name ?? 'U')[0].toUpperCase(),
                                        style: const TextStyle(
                                            color: AppTheme.primaryLight,
                                            fontSize: 34,
                                            fontWeight: FontWeight.bold),
                                      )
                                    : null,
                              ),
                              const SizedBox(height: 12),
                              Text(
                                user?.name ?? '',
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineSmall
                                    ?.copyWith(fontWeight: FontWeight.w700),
                              ),
                              Text(user?.email ?? '',
                                  style:
                                      Theme.of(context).textTheme.bodyMedium),
                              const SizedBox(height: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 12, vertical: 4),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [
                                      AppTheme.primary,
                                      AppTheme.secondary
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  user?.role.replaceAll('_', ' ') ?? '',
                                  style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600),
                                ),
                              ),
                              if (user?.branch != null &&
                                  user!.branch!.isNotEmpty) ...[
                                const SizedBox(height: 8),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Icon(Icons.school_outlined,
                                        size: 14,
                                        color: AppTheme.textSecondary),
                                    const SizedBox(width: 4),
                                    Text(user.branch!,
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodyMedium),
                                  ],
                                ),
                              ],
                              if (user?.phone != null &&
                                  user!.phone!.isNotEmpty) ...[
                                const SizedBox(height: 4),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Icon(Icons.phone_outlined,
                                        size: 14,
                                        color: AppTheme.textSecondary),
                                    const SizedBox(width: 4),
                                    Text(user.phone!,
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodyMedium),
                                  ],
                                ),
                              ],
                            ],
                          ),
                        ),

                        const SizedBox(height: 16),

                        // ── Profile Completeness ─────────────────────
                        if (user != null) _CompletenessCard(user: user),

                        const SizedBox(height: 12),

                        // ── CGPA ─────────────────────────────────────
                        if (user?.cgpa != null)
                          _ProfileCard(
                            title: 'Academic',
                            icon: Icons.grade_rounded,
                            child: Row(
                              children: [
                                const Text('CGPA: ',
                                    style: TextStyle(
                                        color: AppTheme.textSecondary)),
                                Text(
                                    '${user!.cgpa!.toStringAsFixed(2)}',
                                    style: const TextStyle(
                                        color: AppTheme.success,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18)),
                              ],
                            ),
                          ),

                        // ── Skills ───────────────────────────────────
                        if (user != null && user.skills.isNotEmpty)
                          _ProfileCard(
                            title: 'Skills',
                            icon: Icons.code_rounded,
                            child: Wrap(
                              spacing: 8,
                              runSpacing: 6,
                              children: user.skills
                                  .map((s) => Container(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 10, vertical: 5),
                                        decoration: BoxDecoration(
                                          color: AppTheme.primary
                                              .withValues(alpha: 0.15),
                                          borderRadius:
                                              BorderRadius.circular(8),
                                          border: Border.all(
                                              color: AppTheme.primary
                                                  .withValues(alpha: 0.3)),
                                        ),
                                        child: Text(s,
                                            style: const TextStyle(
                                                color: AppTheme.primaryLight,
                                                fontSize: 12)),
                                      ))
                                  .toList(),
                            ),
                          ),

                        // ── Resume ───────────────────────────────────
                        _ProfileCard(
                          title: 'Resume',
                          icon: Icons.description_outlined,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (user?.resume != null &&
                                  user!.resume!.isNotEmpty)
                                const Row(
                                  children: [
                                    Icon(Icons.check_circle_rounded,
                                        color: AppTheme.success, size: 18),
                                    SizedBox(width: 8),
                                    Text('Resume uploaded',
                                        style: TextStyle(
                                            color: AppTheme.success)),
                                  ],
                                ),
                              const SizedBox(height: 10),
                              OutlinedButton.icon(
                                icon: _uploadingResume
                                    ? const SizedBox(
                                        width: 16,
                                        height: 16,
                                        child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            color: AppTheme.primaryLight))
                                    : const Icon(Icons.upload_rounded),
                                label: Text(
                                    user?.resume != null &&
                                            user!.resume!.isNotEmpty
                                        ? 'Replace Resume'
                                        : 'Upload Resume'),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: AppTheme.primaryLight,
                                  side:
                                      const BorderSide(color: AppTheme.primary),
                                ),
                                onPressed:
                                    _uploadingResume ? null : _uploadResume,
                              ),
                            ],
                          ),
                        ),

                        // ── Sign Out ─────────────────────────────────
                        const SizedBox(height: 8),
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor:
                                AppTheme.error.withValues(alpha: 0.85),
                          ),
                          icon: const Icon(Icons.logout_rounded),
                          label: const Text('Sign Out'),
                          onPressed: () => auth.signOut(),
                        ),
                        const SizedBox(height: 20),
                      ],
                    ),
                  ),
                ),
    );
  }
}

// ── Profile Completeness Card ───────────────────────────────────────────────
class _CompletenessCard extends StatelessWidget {
  final dynamic user; // UserModel
  const _CompletenessCard({required this.user});

  @override
  Widget build(BuildContext context) {
    final pct = user.completenessPercent as int;
    final color = pct >= 80
        ? AppTheme.success
        : pct >= 50
            ? AppTheme.warning
            : AppTheme.error;

    final fields = [
      ('Name', user.name != null && (user.name as String).isNotEmpty),
      ('Phone', user.phone != null && (user.phone as String).isNotEmpty),
      ('CGPA', user.cgpa != null),
      ('Branch', user.branch != null && (user.branch as String).isNotEmpty),
      ('Skills', (user.skills as List).isNotEmpty),
      ('Resume', user.resume != null && (user.resume as String).isNotEmpty),
    ];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.bgCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.bgBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Profile Completeness',
                  style: TextStyle(
                      color: AppTheme.textSecondary,
                      fontWeight: FontWeight.w600,
                      fontSize: 13)),
              Text('$pct%',
                  style: TextStyle(
                      color: color,
                      fontWeight: FontWeight.bold,
                      fontSize: 15)),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: pct / 100.0,
              backgroundColor: AppTheme.bgSurface,
              valueColor: AlwaysStoppedAnimation<Color>(color),
              minHeight: 6,
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 6,
            children: fields
                .map((f) => Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: f.$2
                            ? AppTheme.success.withValues(alpha: 0.12)
                            : AppTheme.bgSurface,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(
                          color: f.$2
                              ? AppTheme.success.withValues(alpha: 0.4)
                              : AppTheme.bgBorder,
                        ),
                      ),
                      child: Text(
                        '${f.$2 ? "✓" : "○"} ${f.$1}',
                        style: TextStyle(
                            fontSize: 11,
                            color: f.$2
                                ? AppTheme.success
                                : AppTheme.textMuted),
                      ),
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }
}

// ── Profile Section Card ────────────────────────────────────────────────────
class _ProfileCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Widget child;
  const _ProfileCard(
      {required this.title, required this.icon, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.bgCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.bgBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Icon(icon, size: 16, color: AppTheme.primaryLight),
            const SizedBox(width: 8),
            Text(title,
                style: const TextStyle(
                    color: AppTheme.primaryLight,
                    fontWeight: FontWeight.w600)),
          ]),
          const SizedBox(height: 10),
          child,
        ],
      ),
    );
  }
}
