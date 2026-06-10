import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../providers/drive_provider.dart';
import '../../services/api_service.dart';
import '../../theme.dart';
import 'create_drive_screen.dart';

class DriveDetailScreen extends StatefulWidget {
  final String driveId;
  const DriveDetailScreen({super.key, required this.driveId});

  @override
  State<DriveDetailScreen> createState() => _DriveDetailScreenState();
}

class _DriveDetailScreenState extends State<DriveDetailScreen> {
  bool _applying = false;
  bool _applied = false;
  String? _applyMsg;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<DriveProvider>().fetchDriveById(widget.driveId);
    });
  }

  Future<void> _quickApply() async {
    setState(() => _applying = true);
    try {
      await ApiService.instance.applyForDrive(widget.driveId);
      setState(() {
        _applied = true;
        _applyMsg = 'Application submitted!';
      });
    } catch (e) {
      final data = (e as dynamic).response?.data;
      final msg = data is Map ? data['message'] ?? 'Already applied' : 'Failed';
      setState(() => _applyMsg = msg);
    }
    setState(() => _applying = false);
    if (_applyMsg != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(_applyMsg!),
        backgroundColor: _applied ? AppTheme.success : AppTheme.warning,
        behavior: SnackBarBehavior.floating,
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final driveProvider = context.watch<DriveProvider>();
    final drive = driveProvider.selectedDrive;

    return Scaffold(
      appBar: AppBar(
        title: Text(drive?.company ?? 'Drive Details'),
        actions: [
          if (auth.isOfficer && drive != null) ...[
            IconButton(
              icon: const Icon(Icons.edit_outlined),
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (_) => CreateDriveScreen(existingDrive: drive)),
              ).then((_) =>
                  context.read<DriveProvider>().fetchDriveById(widget.driveId)),
            ),
            IconButton(
              icon: const Icon(Icons.delete_outline, color: AppTheme.error),
              onPressed: () async {
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (_) => AlertDialog(
                    backgroundColor: AppTheme.bgCard,
                    title: const Text('Delete Drive'),
                    content: const Text(
                        'Are you sure? This action cannot be undone.'),
                    actions: [
                      TextButton(
                          onPressed: () => Navigator.pop(context, false),
                          child: const Text('Cancel')),
                      TextButton(
                          onPressed: () => Navigator.pop(context, true),
                          child: const Text('Delete',
                              style: TextStyle(color: AppTheme.error))),
                    ],
                  ),
                );
                if (confirm == true && mounted) {
                  await context
                      .read<DriveProvider>()
                      .deleteDrive(widget.driveId);
                  if (mounted) Navigator.pop(context);
                }
              },
            ),
          ],
        ],
      ),
      body: driveProvider.loading
          ? const Center(child: CircularProgressIndicator())
          : drive == null
              ? const Center(child: Text('Drive not found'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header card
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [
                              Color(0xFF1E1B4B),
                              AppTheme.bgCard,
                            ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppTheme.bgBorder),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 56,
                                  height: 56,
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(colors: [
                                      AppTheme.primary,
                                      AppTheme.secondary
                                    ]),
                                    borderRadius: BorderRadius.circular(14),
                                  ),
                                  child: Center(
                                    child: Text(
                                      drive.company[0].toUpperCase(),
                                      style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 24,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(drive.company,
                                          style: Theme.of(context)
                                              .textTheme
                                              .headlineSmall),
                                      Text(drive.role,
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyLarge
                                              ?.copyWith(
                                                  color:
                                                      AppTheme.primaryLight)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            Wrap(
                              spacing: 10,
                              runSpacing: 8,
                              children: [
                                if (drive.package != null)
                                  _StatBadge(
                                      icon: Icons.currency_rupee_rounded,
                                      label: '${drive.package} LPA',
                                      color: AppTheme.success),
                                if (drive.deadline != null)
                                  _StatBadge(
                                      icon: Icons.calendar_today_outlined,
                                      label: DateFormat('MMM dd, yyyy')
                                          .format(drive.deadline!),
                                      color: AppTheme.warning),
                                if (drive.jobType != null)
                                  _StatBadge(
                                      icon: Icons.work_outline,
                                      label: drive.jobType!
                                          .replaceAll('_', ' '),
                                      color: AppTheme.primary),
                                if (drive.minGpa != null)
                                  _StatBadge(
                                      icon: Icons.grade_outlined,
                                      label: 'Min GPA: ${drive.minGpa}',
                                      color: AppTheme.info),
                              ],
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 16),

                      // Job Description
                      if (drive.description != null)
                        _Section(
                          title: 'Job Description',
                          child: Text(drive.description!,
                              style: Theme.of(context).textTheme.bodyMedium),
                        ),

                      // Eligible Branches
                      if (drive.eligibleBranches != null &&
                          drive.eligibleBranches!.isNotEmpty)
                        _Section(
                          title: 'Eligible Branches',
                          child: Wrap(
                            spacing: 8,
                            runSpacing: 6,
                            children: drive.eligibleBranches!
                                .map((b) => Chip(label: Text(b)))
                                .toList(),
                          ),
                        ),

                      // Selection Rounds
                      if (drive.selectionRounds != null &&
                          drive.selectionRounds!.isNotEmpty)
                        _Section(
                          title: 'Selection Rounds',
                          child: Column(
                            children: drive.selectionRounds!
                                .asMap()
                                .entries
                                .map((e) => Padding(
                                      padding:
                                          const EdgeInsets.only(bottom: 8),
                                      child: Row(
                                        children: [
                                          Container(
                                            width: 28,
                                            height: 28,
                                            decoration: BoxDecoration(
                                              color: AppTheme.primary
                                                  .withOpacity(0.2),
                                              borderRadius:
                                                  BorderRadius.circular(14),
                                            ),
                                            child: Center(
                                              child: Text(
                                                '${e.key + 1}',
                                                style: const TextStyle(
                                                    color: AppTheme.primaryLight,
                                                    fontWeight:
                                                        FontWeight.bold,
                                                    fontSize: 12),
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 10),
                                          Expanded(
                                            child: Text(
                                              e.value['name'] ??
                                                  e.value['round'] ??
                                                  '',
                                              style: Theme.of(context)
                                                  .textTheme
                                                  .bodyMedium,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ))
                                .toList(),
                          ),
                        ),

                      // Timeline
                      if (drive.timeline != null &&
                          drive.timeline!.isNotEmpty)
                        _Section(
                          title: 'Timeline',
                          child: Column(
                            children: drive.timeline!
                                .map((t) => Padding(
                                      padding:
                                          const EdgeInsets.only(bottom: 8),
                                      child: Row(
                                        children: [
                                          const Icon(
                                              Icons.timeline_outlined,
                                              size: 16,
                                              color: AppTheme.accent),
                                          const SizedBox(width: 8),
                                          Expanded(
                                            child: Text(
                                              '${t['event'] ?? t['title'] ?? ''}: ${t['date'] ?? ''}',
                                              style: Theme.of(context)
                                                  .textTheme
                                                  .bodyMedium,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ))
                                .toList(),
                          ),
                        ),

                      // Registration Link
                      if (drive.registrationLink != null)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.accent),
                            icon: const Icon(Icons.open_in_new_rounded),
                            label: const Text('External Registration Link'),
                            onPressed: () async {
                              final uri =
                                  Uri.tryParse(drive.registrationLink!);
                              if (uri != null &&
                                  await canLaunchUrl(uri)) {
                                await launchUrl(uri,
                                    mode: LaunchMode.externalApplication);
                              }
                            },
                          ),
                        ),

                      const SizedBox(height: 80),
                    ],
                  ),
                ),
      // Quick Apply FAB
      floatingActionButton: drive != null && !auth.isOfficer
          ? FloatingActionButton.extended(
              onPressed: _applying || _applied ? null : _quickApply,
              backgroundColor:
                  _applied ? AppTheme.success : AppTheme.primary,
              icon: _applying
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white))
                  : Icon(_applied
                      ? Icons.check_circle_outline
                      : Icons.send_rounded),
              label: Text(_applied ? 'Applied!' : 'Quick Apply'),
            )
          : null,
    );
  }
}

class _Section extends StatelessWidget {
  final String title;
  final Widget child;
  const _Section({required this.title, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.bgCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.bgBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(color: AppTheme.primaryLight)),
          const SizedBox(height: 10),
          child,
        ],
      ),
    );
  }
}

class _StatBadge extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _StatBadge(
      {required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Text(label,
              style: TextStyle(
                  color: color, fontSize: 12, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
