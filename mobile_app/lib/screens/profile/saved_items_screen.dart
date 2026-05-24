import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../theme.dart';
import '../drives/drive_detail_screen.dart';

class SavedItemsScreen extends StatefulWidget {
  const SavedItemsScreen({super.key});

  @override
  State<SavedItemsScreen> createState() => _SavedItemsScreenState();
}

class _SavedItemsScreenState extends State<SavedItemsScreen> {
  List<dynamic> _savedDrives = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final res = await ApiService.instance.getBookmarks();
      final data = res.data;
      _savedDrives = (data is Map)
          ? (data['savedDrives'] ?? data['drives'] ?? [])
          : (data is List ? data : []);
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    setState(() => _loading = false);
  }

  Future<void> _removeBookmark(String driveId) async {
    try {
      await ApiService.instance.toggleBookmark('drives', driveId);
      setState(() => _savedDrives.removeWhere((d) => d['_id'] == driveId));
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Saved Drives')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline,
                          color: AppTheme.error, size: 48),
                      const SizedBox(height: 12),
                      TextButton(
                          onPressed: _load, child: const Text('Retry')),
                    ],
                  ),
                )
              : _savedDrives.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.bookmark_border_rounded,
                              size: 72, color: AppTheme.textMuted),
                          SizedBox(height: 16),
                          Text(
                            'No saved drives',
                            style: TextStyle(
                                color: AppTheme.textMuted, fontSize: 16),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Bookmark drives to access them quickly.',
                            style: TextStyle(
                                color: AppTheme.textMuted, fontSize: 13),
                          ),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _load,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: _savedDrives.length,
                        itemBuilder: (_, i) {
                          final drive = _savedDrives[i] as Map;
                          final driveId =
                              drive['_id']?.toString() ?? '';
                          final company =
                              drive['companyName'] ?? drive['company'] ?? '';
                          final role =
                              drive['jobRole'] ?? drive['role'] ?? '';
                          final jobType =
                              drive['jobType']?.toString() ?? '';

                          return Card(
                            child: ListTile(
                              contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 8),
                              leading: Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [
                                      AppTheme.primary,
                                      AppTheme.secondary
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Center(
                                  child: Text(
                                    company.isNotEmpty
                                        ? company[0].toUpperCase()
                                        : '?',
                                    style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ),
                              title: Text(company,
                                  style: const TextStyle(
                                      fontWeight: FontWeight.w700)),
                              subtitle: Text(role),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  if (jobType.isNotEmpty)
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 7, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: AppTheme.primary
                                            .withValues(alpha: 0.15),
                                        borderRadius:
                                            BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        jobType.replaceAll('_', ' '),
                                        style: const TextStyle(
                                            color: AppTheme.primaryLight,
                                            fontSize: 10),
                                      ),
                                    ),
                                  const SizedBox(width: 8),
                                  IconButton(
                                    icon: const Icon(Icons.bookmark_rounded,
                                        color: AppTheme.warning, size: 20),
                                    tooltip: 'Remove bookmark',
                                    onPressed: () =>
                                        _removeBookmark(driveId),
                                  ),
                                ],
                              ),
                              onTap: driveId.isNotEmpty
                                  ? () => Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (_) =>
                                                DriveDetailScreen(
                                                    driveId: driveId)),
                                      )
                                  : null,
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
