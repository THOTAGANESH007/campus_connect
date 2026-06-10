import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../services/api_service.dart';
import '../../models/material_model.dart';
import '../../theme.dart';
import 'package:file_picker/file_picker.dart';
import 'package:dio/dio.dart';

class MaterialsScreen extends StatefulWidget {
  const MaterialsScreen({super.key});

  @override
  State<MaterialsScreen> createState() => _MaterialsScreenState();
}

class _MaterialsScreenState extends State<MaterialsScreen> {
  List<MaterialModel> _materials = [];
  bool _loading = true;
  String? _error;
  String _selectedType = '';
  final List<String> _types = ['', 'DSA', 'Aptitude', 'Verbal', 'Technical', 'HR', 'Other'];

  @override
  void initState() {
    super.initState();
    _fetchMaterials();
  }

  Future<void> _fetchMaterials() async {
    setState(() => _loading = true);
    try {
      final params = _selectedType.isNotEmpty ? {'type': _selectedType} : null;
      final res = await ApiService.instance.getMaterials(params);
      final list = res.data is List
          ? res.data
          : (res.data['materials'] ?? res.data['data'] ?? []);
      _materials = (list as List)
          .map((e) => MaterialModel.fromJson(Map<String, dynamic>.from(e)))
          .toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    setState(() => _loading = false);
  }

  Future<void> _upvote(String id) async {
    try {
      await ApiService.instance.upvoteMaterial(id);
      _fetchMaterials();
    } catch (_) {}
  }

  Future<void> _openResource(MaterialModel mat) async {
    if (mat.resourceUrl != null) {
      await ApiService.instance.incrementDownload(mat.id);
      final uri = Uri.tryParse(mat.resourceUrl!);
      if (uri != null && await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    }
  }

  void _showShareDialog() {
    final titleCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    final urlCtrl = TextEditingController();
    String type = 'DSA';
    PlatformFile? pickedFile;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.bgCard,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
              left: 16,
              right: 16,
              top: 20,
              bottom: MediaQuery.of(ctx).viewInsets.bottom + 20),
          child: StatefulBuilder(builder: (ctx2, sb) {
            return SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Share Material',
                      style: Theme.of(ctx2).textTheme.titleLarge),
                  const SizedBox(height: 16),
                  TextField(
                      controller: titleCtrl,
                      decoration: const InputDecoration(labelText: 'Title')),
                  const SizedBox(height: 12),
                  TextField(
                      controller: descCtrl,
                      maxLines: 2,
                      decoration:
                          const InputDecoration(labelText: 'Description')),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: type,
                    dropdownColor: AppTheme.bgCard,
                    decoration: const InputDecoration(labelText: 'Category'),
                    items: ['DSA', 'Aptitude', 'Verbal', 'Technical', 'HR', 'Other']
                        .map((t) => DropdownMenuItem(
                            value: t,
                            child: Text(t,
                                style: const TextStyle(
                                    color: AppTheme.textPrimary))))
                        .toList(),
                    onChanged: (v) => sb(() => type = v!),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                      controller: urlCtrl,
                      decoration: const InputDecoration(
                          labelText: 'Resource URL (optional)',
                          prefixIcon: Icon(Icons.link_rounded))),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    icon: const Icon(Icons.attach_file_rounded),
                    label: Text(pickedFile == null
                        ? 'Attach File (optional)'
                        : pickedFile!.name),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.primaryLight,
                      side: const BorderSide(color: AppTheme.bgBorder),
                    ),
                    onPressed: () async {
                      final result = await FilePicker.platform.pickFiles();
                      if (result != null) sb(() => pickedFile = result.files.first);
                    },
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () async {
                      if (titleCtrl.text.isEmpty) return;
                      final formData = FormData.fromMap({
                        'title': titleCtrl.text.trim(),
                        'description': descCtrl.text.trim(),
                        'type': type,
                        if (urlCtrl.text.isNotEmpty)
                          'resourceUrl': urlCtrl.text.trim(),
                        if (pickedFile?.path != null)
                          'file': await MultipartFile.fromFile(
                              pickedFile!.path!,
                              filename: pickedFile!.name),
                      });
                      try {
                        await ApiService.instance.createMaterial(formData);
                        if (ctx.mounted) Navigator.pop(ctx);
                        _fetchMaterials();
                      } catch (_) {}
                    },
                    child: const Text('Share'),
                  ),
                ],
              ),
            );
          }),
        );
      },
    );
  }

  Color _typeColor(String? type) {
    switch (type) {
      case 'DSA': return AppTheme.primary;
      case 'Aptitude': return AppTheme.warning;
      case 'Technical': return AppTheme.accent;
      case 'HR': return AppTheme.success;
      default: return AppTheme.textSecondary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Placement Materials'),
        leading: IconButton(
          icon: const Icon(Icons.menu_rounded),
          onPressed: () => context
              .read<GlobalKey<ScaffoldState>>()
              .currentState
              ?.openDrawer(),
        ),
      ),

      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showShareDialog,
        icon: const Icon(Icons.upload_rounded),
        label: const Text('Share'),
      ),
      body: Column(
        children: [
          // Type filter
          Container(
            color: AppTheme.bgCard,
            height: 52,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              children: _types.map((t) {
                final selected = _selectedType == t;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(t.isEmpty ? 'All' : t),
                    selected: selected,
                    onSelected: (_) {
                      setState(() => _selectedType = t);
                      _fetchMaterials();
                    },
                  ),
                );
              }).toList(),
            ),
          ),

          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.error_outline,
                                color: AppTheme.error, size: 48),
                            TextButton(
                                onPressed: _fetchMaterials,
                                child: const Text('Retry')),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _fetchMaterials,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(12),
                          itemCount: _materials.length,
                          itemBuilder: (_, i) {
                            final mat = _materials[i];
                            return Card(
                              child: Padding(
                                padding: const EdgeInsets.all(14),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        if (mat.type != null)
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 8, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: _typeColor(mat.type)
                                                  .withOpacity(0.15),
                                              borderRadius:
                                                  BorderRadius.circular(6),
                                            ),
                                            child: Text(mat.type!,
                                                style: TextStyle(
                                                    color: _typeColor(mat.type),
                                                    fontSize: 11)),
                                          ),
                                        const Spacer(),
                                        Icon(Icons.download_outlined,
                                            size: 14,
                                            color: AppTheme.textMuted),
                                        const SizedBox(width: 4),
                                        Text('${mat.downloadCount}',
                                            style: const TextStyle(
                                                color: AppTheme.textMuted,
                                                fontSize: 12)),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(mat.title,
                                        style: Theme.of(context)
                                            .textTheme
                                            .titleMedium
                                            ?.copyWith(
                                                fontWeight: FontWeight.w600)),
                                    if (mat.description != null &&
                                        mat.description!.isNotEmpty) ...[
                                      const SizedBox(height: 4),
                                      Text(mat.description!,
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium,
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis),
                                    ],
                                    const SizedBox(height: 12),
                                    Row(
                                      children: [
                                        InkWell(
                                          onTap: () => _upvote(mat.id),
                                          borderRadius:
                                              BorderRadius.circular(8),
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 10, vertical: 6),
                                            decoration: BoxDecoration(
                                              color: AppTheme.primary
                                                  .withOpacity(0.1),
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                            child: Row(children: [
                                              const Icon(
                                                  Icons.thumb_up_outlined,
                                                  size: 14,
                                                  color: AppTheme.primaryLight),
                                              const SizedBox(width: 4),
                                              Text('${mat.upvotes.length}',
                                                  style: const TextStyle(
                                                      color:
                                                          AppTheme.primaryLight,
                                                      fontSize: 12)),
                                            ]),
                                          ),
                                        ),
                                        const Spacer(),
                                        if (mat.resourceUrl != null)
                                          ElevatedButton.icon(
                                            style: ElevatedButton.styleFrom(
                                              minimumSize: Size.zero,
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                      horizontal: 12,
                                                      vertical: 8),
                                              backgroundColor:
                                                  AppTheme.primary,
                                            ),
                                            icon: const Icon(
                                                Icons.open_in_new_rounded,
                                                size: 14),
                                            label: const Text('Open',
                                                style: TextStyle(fontSize: 13)),
                                            onPressed: () =>
                                                _openResource(mat),
                                          ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}
