import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/drive_provider.dart';
import '../../models/drive_model.dart';
import '../../services/api_service.dart';
import '../../theme.dart';
import 'drive_detail_screen.dart';
import 'create_drive_screen.dart';
import 'package:intl/intl.dart';

class DriveListScreen extends StatefulWidget {
  const DriveListScreen({super.key});

  @override
  State<DriveListScreen> createState() => _DriveListScreenState();
}

class _DriveListScreenState extends State<DriveListScreen> {
  final _searchCtrl = TextEditingController();
  String _selectedJobType = '';
  final List<String> _jobTypes = ['', 'Full-time', 'Internship'];
  final Set<String> _savedIds = {};

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<DriveProvider>().fetchDrives();
    });
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _search() async {
    context.read<DriveProvider>().fetchDrives(
          search: _searchCtrl.text,
          jobType: _selectedJobType,
        );
  }

  Future<void> _toggleBookmark(String driveId) async {
    // Optimistic UI
    setState(() {
      if (_savedIds.contains(driveId)) {
        _savedIds.remove(driveId);
      } else {
        _savedIds.add(driveId);
      }
    });
    try {
      await ApiService.instance.toggleBookmark('drives', driveId);
    } catch (_) {
      // Revert on failure
      setState(() {
        if (_savedIds.contains(driveId)) {
          _savedIds.remove(driveId);
        } else {
          _savedIds.add(driveId);
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final driveProvider = context.watch<DriveProvider>();

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.menu_rounded),
          onPressed: () => context
              .read<GlobalKey<ScaffoldState>>()
              .currentState
              ?.openDrawer(),
        ),
        title: const Text('Placement Drives'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _search,
          ),
        ],
      ),
      floatingActionButton: auth.isOfficer
          ? FloatingActionButton.extended(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CreateDriveScreen()),
              ).then((_) => _search()),
              icon: const Icon(Icons.add_rounded),
              label: const Text('Create Drive'),
            )
          : null,
      body: Column(
        children: [
          // Search + Filter
          Container(
            color: AppTheme.bgCard,
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
            child: Column(
              children: [
                TextField(
                  controller: _searchCtrl,
                  decoration: InputDecoration(
                    hintText: 'Search company, role...',
                    prefixIcon: const Icon(Icons.search_rounded),
                    suffixIcon: _searchCtrl.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              _searchCtrl.clear();
                              _search();
                            })
                        : null,
                  ),
                  onSubmitted: (_) => _search(),
                  onChanged: (_) => setState(() {}),
                ),
                const SizedBox(height: 10),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: _jobTypes.map((jt) {
                      final label = jt.isEmpty ? 'All Types' : jt;
                      final selected = _selectedJobType == jt;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(label),
                          selected: selected,
                          onSelected: (_) {
                            setState(() => _selectedJobType = jt);
                            _search();
                          },
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),

          // Drive Count
          if (!driveProvider.loading)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
              child: Row(
                children: [
                  Text(
                    '${driveProvider.drives.length} Drives Found',
                    style: Theme.of(context)
                        .textTheme
                        .bodyMedium
                        ?.copyWith(color: AppTheme.primaryLight),
                  ),
                ],
              ),
            ),

          // List
          Expanded(
            child: driveProvider.loading
                ? const Center(child: CircularProgressIndicator())
                : driveProvider.error != null
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.error_outline,
                                color: AppTheme.error, size: 48),
                            const SizedBox(height: 12),
                            Text('Failed to load drives',
                                style: Theme.of(context).textTheme.bodyLarge),
                            TextButton(
                                onPressed: _search, child: const Text('Retry')),
                          ],
                        ),
                      )
                    : driveProvider.drives.isEmpty
                        ? const Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.work_off_outlined,
                                    color: AppTheme.textMuted, size: 64),
                                SizedBox(height: 12),
                                Text('No drives found',
                                    style:
                                        TextStyle(color: AppTheme.textMuted)),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _search,
                            child: ListView.builder(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              itemCount: driveProvider.drives.length,
                              itemBuilder: (_, i) => _DriveCard(
                                drive: driveProvider.drives[i],
                                isOfficer: auth.isOfficer,
                                isSaved: _savedIds
                                    .contains(driveProvider.drives[i].id),
                                onBookmark: () =>
                                    _toggleBookmark(driveProvider.drives[i].id),
                                onTap: () => Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => DriveDetailScreen(
                                        driveId: driveProvider.drives[i].id),
                                  ),
                                ).then((_) => _search()),
                              ),
                            ),
                          ),
          ),
        ],
      ),
    );
  }
}

class _DriveCard extends StatelessWidget {
  final DriveModel drive;
  final bool isOfficer;
  final bool isSaved;
  final VoidCallback onTap;
  final VoidCallback onBookmark;
  const _DriveCard({
    required this.drive,
    required this.isOfficer,
    required this.isSaved,
    required this.onTap,
    required this.onBookmark,
  });

  @override
  Widget build(BuildContext context) {
    final deadline = drive.deadline;
    final isExpired = deadline != null && deadline.isBefore(DateTime.now());

    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  // Company logo placeholder
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                          colors: [AppTheme.primary, AppTheme.secondary]),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Center(
                      child: Text(
                        drive.company[0].toUpperCase(),
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(drive.company,
                            style: Theme.of(context)
                                .textTheme
                                .titleMedium
                                ?.copyWith(fontWeight: FontWeight.w700)),
                        Text(drive.role,
                            style: Theme.of(context).textTheme.bodyMedium),
                      ],
                    ),
                  ),
                  if (drive.jobType != null)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        drive.jobType!.replaceAll('_', ' '),
                        style: const TextStyle(
                            color: AppTheme.primaryLight, fontSize: 11),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 4,
                children: [
                  if (drive.package != null)
                    _InfoChip(
                        icon: Icons.currency_rupee_rounded,
                        label: '${drive.package} LPA'),
                  if (deadline != null)
                    _InfoChip(
                      icon: Icons.calendar_today_outlined,
                      label: DateFormat('MMM dd, yyyy').format(deadline),
                      color:
                          isExpired ? AppTheme.error : AppTheme.textSecondary,
                    ),
                  if (drive.minGpa != null)
                    _InfoChip(
                        icon: Icons.grade_outlined,
                        label: 'GPA ≥ ${drive.minGpa}'),
                ],
              ),
              const SizedBox(height: 12),
              // ── Bottom action row: bookmark ──
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  GestureDetector(
                    onTap: onBookmark,
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: isSaved
                            ? const Color(0xFFFFF8E1)
                            : AppTheme.bgSurface,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: isSaved
                              ? AppTheme.warning
                              : AppTheme.bgBorder,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            isSaved
                                ? Icons.bookmark_rounded
                                : Icons.bookmark_border_rounded,
                            size: 16,
                            color: isSaved
                                ? AppTheme.warning
                                : AppTheme.textMuted,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            isSaved ? 'Saved' : 'Save',
                            style: TextStyle(
                                fontSize: 12,
                                color: isSaved
                                    ? AppTheme.warning
                                    : AppTheme.textMuted,
                                fontWeight: FontWeight.w500),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}




class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _InfoChip(
      {required this.icon,
      required this.label,
      this.color = AppTheme.textSecondary});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 13, color: color),
        const SizedBox(width: 4),
        Text(label, style: TextStyle(color: color, fontSize: 12)),
      ],
    );
  }
}
