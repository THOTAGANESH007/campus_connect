import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';
import '../../models/interview_model.dart';
import '../../theme.dart';
import 'package:intl/intl.dart';

class MyApplicationsScreen extends StatefulWidget {
  const MyApplicationsScreen({super.key});

  @override
  State<MyApplicationsScreen> createState() => _MyApplicationsScreenState();
}

class _MyApplicationsScreenState extends State<MyApplicationsScreen> {
  List<ApplicationModel> _apps = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchApplications();
  }

  Future<void> _fetchApplications() async {
    setState(() => _loading = true);
    try {
      final res = await ApiService.instance.getMyApplications();
      final list = res.data is List
          ? res.data
          : (res.data['applications'] ?? res.data['data'] ?? []);
      _apps = (list as List)
          .map((e) => ApplicationModel.fromJson(Map<String, dynamic>.from(e)))
          .toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    setState(() => _loading = false);
  }

  Color _statusColor(String status) {
    switch (status.toUpperCase()) {
      case 'PLACED': case 'SHORTLISTED': return AppTheme.success;
      case 'REJECTED': return AppTheme.error;
      case 'PENDING': case 'APPLIED': return AppTheme.warning;
      default: return AppTheme.info;
    }
  }

  IconData _statusIcon(String status) {
    switch (status.toUpperCase()) {
      case 'PLACED': return Icons.emoji_events_rounded;
      case 'SHORTLISTED': return Icons.check_circle_rounded;
      case 'REJECTED': return Icons.cancel_rounded;
      default: return Icons.hourglass_empty_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Applications'),
        automaticallyImplyLeading: false,
        leading: IconButton(
          icon: const Icon(Icons.menu_rounded),
          onPressed: () => context
              .read<GlobalKey<ScaffoldState>>()
              .currentState
              ?.openDrawer(),
        ),
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
                      const SizedBox(height: 12),
                      TextButton(
                          onPressed: _fetchApplications,
                          child: const Text('Retry')),
                    ],
                  ),
                )
              : _apps.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.assignment_outlined,
                              color: AppTheme.textMuted, size: 64),
                          SizedBox(height: 12),
                          Text('No applications yet',
                              style: TextStyle(color: AppTheme.textMuted)),
                          SizedBox(height: 6),
                          Text(
                            'Apply to placement drives to see them here',
                            style: TextStyle(
                                color: AppTheme.textMuted, fontSize: 12),
                          ),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _fetchApplications,
                      child: Column(
                        children: [
                          // Stats row
                          Container(
                            color: AppTheme.bgCard,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 12),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                _miniStat(
                                    'Total',
                                    '${_apps.length}',
                                    AppTheme.primary),
                                _miniStat(
                                    'Placed',
                                    '${_apps.where((a) => a.status.toUpperCase() == 'PLACED').length}',
                                    AppTheme.success),
                                _miniStat(
                                    'Shortlisted',
                                    '${_apps.where((a) => a.status.toUpperCase() == 'SHORTLISTED').length}',
                                    AppTheme.warning),
                                _miniStat(
                                    'Rejected',
                                    '${_apps.where((a) => a.status.toUpperCase() == 'REJECTED').length}',
                                    AppTheme.error),
                              ],
                            ),
                          ),
                          Expanded(
                            child: ListView.builder(
                              padding: const EdgeInsets.all(12),
                              itemCount: _apps.length,
                              itemBuilder: (_, i) {
                                final app = _apps[i];
                                final color = _statusColor(app.status);
                                return Card(
                                  child: Padding(
                                    padding: const EdgeInsets.all(16),
                                    child: Row(
                                      children: [
                                        Container(
                                          width: 48,
                                          height: 48,
                                          decoration: BoxDecoration(
                                            gradient: const LinearGradient(
                                                colors: [
                                                  AppTheme.primary,
                                                  AppTheme.secondary
                                                ]),
                                            borderRadius:
                                                BorderRadius.circular(12),
                                          ),
                                          child: Center(
                                            child: Text(
                                              (app.company ?? 'C')[0]
                                                  .toUpperCase(),
                                              style: const TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 20,
                                                  fontWeight:
                                                      FontWeight.bold),
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 14),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                  app.company ?? 'Unknown',
                                                  style: Theme.of(context)
                                                      .textTheme
                                                      .titleMedium
                                                      ?.copyWith(
                                                          fontWeight:
                                                              FontWeight.w700)),
                                              Text(app.role ?? '',
                                                  style: Theme.of(context)
                                                      .textTheme
                                                      .bodyMedium),
                                              if (app.appliedAt != null)
                                                Text(
                                                  'Applied: ${DateFormat('MMM dd').format(DateTime.tryParse(app.appliedAt!) ?? DateTime.now())}',
                                                  style: const TextStyle(
                                                      color: AppTheme.textMuted,
                                                      fontSize: 11),
                                                ),
                                            ],
                                          ),
                                        ),
                                        Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.end,
                                          children: [
                                            Icon(_statusIcon(app.status),
                                                color: color, size: 20),
                                            const SizedBox(height: 4),
                                            Container(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                      horizontal: 8,
                                                      vertical: 3),
                                              decoration: BoxDecoration(
                                                color:
                                                    color.withOpacity(0.12),
                                                borderRadius:
                                                    BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                app.status,
                                                style: TextStyle(
                                                    color: color,
                                                    fontSize: 11,
                                                    fontWeight:
                                                        FontWeight.w600),
                                              ),
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
                        ],
                      ),
                    ),
    );
  }

  Widget _miniStat(String label, String value, Color color) {
    return Column(
      children: [
        Text(value,
            style: TextStyle(
                color: color, fontSize: 20, fontWeight: FontWeight.w800)),
        Text(label,
            style:
                const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
      ],
    );
  }
}
