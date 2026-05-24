import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../services/api_service.dart';
import '../../theme.dart';

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  Map<String, dynamic>? _overview;
  List<dynamic> _byCompany = [];
  List<dynamic> _byBranch = [];
  List<dynamic> _statusDist = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadAll();
  }

  Future<void> _loadAll() async {
    setState(() => _loading = true);
    try {
      final results = await Future.wait([
        ApiService.instance.getAnalyticsOverview(),
        ApiService.instance.getAnalyticsByCompany(),
        ApiService.instance.getAnalyticsByBranch(),
        ApiService.instance.getStatusDistribution(),
      ]);
      _overview = results[0].data is Map
          ? Map<String, dynamic>.from(results[0].data)
          : {};
      _byCompany = results[1].data is List
          ? results[1].data
          : (results[1].data['data'] ?? []);
      _byBranch = results[2].data is List
          ? results[2].data
          : (results[2].data['data'] ?? []);
      _statusDist = results[3].data is List
          ? results[3].data
          : (results[3].data['data'] ?? []);
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    setState(() => _loading = false);
  }

  // Generate distinct colors for pie
  static const _pieColors = [
    AppTheme.primary,
    AppTheme.secondary,
    AppTheme.accent,
    AppTheme.success,
    AppTheme.warning,
    AppTheme.error,
    AppTheme.info,
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Placement Analytics'),
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
                        onPressed: _loadAll, child: const Text('Retry')),
                  ],
                ))
              : RefreshIndicator(
                  onRefresh: _loadAll,
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(16),
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // KPI Overview
                        if (_overview != null)
                          GridView.count(
                            crossAxisCount: 2,
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            mainAxisSpacing: 12,
                            crossAxisSpacing: 12,
                            childAspectRatio: 1.5,
                            children: [
                              _KpiCard(
                                label: 'Total Students',
                                value: '${_overview!['totalStudents'] ?? 0}',
                                icon: Icons.people_rounded,
                                color: AppTheme.primary,
                              ),
                              _KpiCard(
                                label: 'Placed',
                                value: '${_overview!['totalPlaced'] ?? 0}',
                                icon: Icons.check_circle_rounded,
                                color: AppTheme.success,
                              ),
                              _KpiCard(
                                label: 'Avg Package',
                                value:
                                    '₹${_overview!['averagePackage']?.toStringAsFixed(1) ?? '0'} LPA',
                                icon: Icons.currency_rupee_rounded,
                                color: AppTheme.warning,
                              ),
                              _KpiCard(
                                label: 'Active Drives',
                                value: '${_overview!['activeDrives'] ?? 0}',
                                icon: Icons.work_rounded,
                                color: AppTheme.info,
                              ),
                            ],
                          ),

                        const SizedBox(height: 24),

                        // By Company Bar Chart
                        if (_byCompany.isNotEmpty) ...[
                          _SectionTitle('Placements by Company'),
                          const SizedBox(height: 12),
                          Container(
                            height: 240,
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppTheme.bgCard,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppTheme.bgBorder),
                            ),
                            child: BarChart(
                              BarChartData(
                                alignment: BarChartAlignment.spaceAround,
                                maxY: (_byCompany
                                            .map((e) => (e['count'] as num?)?.toDouble() ?? 0.0)
                                            .fold<double>(0.0, (a, b) => a > b ? a : b) *
                                        1.3)
                                    .clamp(1, double.infinity),
                                barGroups: _byCompany
                                    .take(7)
                                    .toList()
                                    .asMap()
                                    .entries
                                    .map((entry) => BarChartGroupData(
                                          x: entry.key,
                                          barRods: [
                                            BarChartRodData(
                                              toY: (entry.value['count'] as num?)
                                                      ?.toDouble() ??
                                                  0,
                                              gradient: const LinearGradient(
                                                colors: [
                                                  AppTheme.primary,
                                                  AppTheme.secondary
                                                ],
                                                begin: Alignment.bottomCenter,
                                                end: Alignment.topCenter,
                                              ),
                                              width: 18,
                                              borderRadius:
                                                  BorderRadius.circular(4),
                                            ),
                                          ],
                                        ))
                                    .toList(),
                                titlesData: FlTitlesData(
                                  bottomTitles: AxisTitles(
                                    sideTitles: SideTitles(
                                      showTitles: true,
                                      getTitlesWidget: (val, meta) {
                                        final idx = val.toInt();
                                        if (idx >= _byCompany.length) {
                                          return const SizedBox.shrink();
                                        }
                                        final company =
                                            _byCompany[idx]['company'] ?? '';
                                        return Padding(
                                          padding: const EdgeInsets.only(top: 4),
                                          child: Text(
                                            company.length > 6
                                                ? '${company.substring(0, 6)}…'
                                                : company,
                                            style: const TextStyle(
                                                color: AppTheme.textMuted,
                                                fontSize: 10),
                                          ),
                                        );
                                      },
                                    ),
                                  ),
                                  leftTitles: AxisTitles(
                                    sideTitles: SideTitles(
                                      showTitles: true,
                                      reservedSize: 28,
                                      getTitlesWidget: (val, meta) => Text(
                                        val.toInt().toString(),
                                        style: const TextStyle(
                                            color: AppTheme.textMuted,
                                            fontSize: 10),
                                      ),
                                    ),
                                  ),
                                  topTitles: const AxisTitles(
                                      sideTitles:
                                          SideTitles(showTitles: false)),
                                  rightTitles: const AxisTitles(
                                      sideTitles:
                                          SideTitles(showTitles: false)),
                                ),
                                gridData:
                                    const FlGridData(drawVerticalLine: false),
                                borderData: FlBorderData(show: false),
                              ),
                            ),
                          ),
                        ],

                        const SizedBox(height: 24),

                        // Status Distribution Pie Chart
                        if (_statusDist.isNotEmpty) ...[
                          _SectionTitle('Application Status Distribution'),
                          const SizedBox(height: 12),
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppTheme.bgCard,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppTheme.bgBorder),
                            ),
                            child: Column(
                              children: [
                                SizedBox(
                                  height: 200,
                                  child: PieChart(
                                    PieChartData(
                                      sections: _statusDist
                                          .asMap()
                                          .entries
                                          .map((e) => PieChartSectionData(
                                                value: (e.value['count']
                                                        as num?)
                                                    ?.toDouble() ??
                                                    0,
                                                color: _pieColors[
                                                    e.key % _pieColors.length],
                                                title:
                                                    '${e.value['count']}',
                                                titleStyle: const TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 12,
                                                    fontWeight:
                                                        FontWeight.bold),
                                                radius: 70,
                                              ))
                                          .toList(),
                                      sectionsSpace: 2,
                                      centerSpaceRadius: 40,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Wrap(
                                  spacing: 16,
                                  runSpacing: 8,
                                  children: _statusDist
                                      .asMap()
                                      .entries
                                      .map((e) => Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Container(
                                                width: 10,
                                                height: 10,
                                                decoration: BoxDecoration(
                                                  color: _pieColors[e.key %
                                                      _pieColors.length],
                                                  borderRadius:
                                                      BorderRadius.circular(2),
                                                ),
                                              ),
                                              const SizedBox(width: 6),
                                              Text(
                                                e.value['status'] ?? '',
                                                style: const TextStyle(
                                                    color:
                                                        AppTheme.textSecondary,
                                                    fontSize: 12),
                                              ),
                                            ],
                                          ))
                                      .toList(),
                                ),
                              ],
                            ),
                          ),
                        ],

                        const SizedBox(height: 24),

                        // By Branch
                        if (_byBranch.isNotEmpty) ...[
                          _SectionTitle('Branch-wise Placements'),
                          const SizedBox(height: 12),
                          ..._byBranch.map((b) {
                            final placed =
                                (b['placed'] as num?)?.toDouble() ?? 0;
                            final total =
                                (b['total'] as num?)?.toDouble() ?? 1;
                            final pct = placed / total;
                            return Container(
                              margin: const EdgeInsets.only(bottom: 10),
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: AppTheme.bgCard,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppTheme.bgBorder),
                              ),
                              child: Column(
                                children: [
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(b['branch'] ?? '',
                                          style: Theme.of(context)
                                              .textTheme
                                              .titleSmall
                                              ?.copyWith(
                                                  color:
                                                      AppTheme.textPrimary)),
                                      Text(
                                          '${placed.toInt()} / ${total.toInt()}',
                                          style: const TextStyle(
                                              color: AppTheme.primaryLight,
                                              fontSize: 13)),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(4),
                                    child: LinearProgressIndicator(
                                      value: pct.clamp(0, 1),
                                      backgroundColor: AppTheme.bgSurface,
                                      valueColor:
                                          const AlwaysStoppedAnimation<Color>(
                                              AppTheme.primary),
                                      minHeight: 6,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Align(
                                    alignment: Alignment.centerRight,
                                    child: Text(
                                        '${(pct * 100).toStringAsFixed(1)}%',
                                        style: const TextStyle(
                                            color: AppTheme.textMuted,
                                            fontSize: 11)),
                                  ),
                                ],
                              ),
                            );
                          }),
                        ],
                      ],
                    ),
                  ),
                ),
    );
  }
}

class _KpiCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  const _KpiCard(
      {required this.label,
      required this.value,
      required this.icon,
      required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.bgCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 8),
          Text(value,
              style: TextStyle(
                  color: color,
                  fontSize: 22,
                  fontWeight: FontWeight.w800)),
          Text(label,
              style: const TextStyle(
                  color: AppTheme.textMuted, fontSize: 12)),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  const _SectionTitle(this.title);

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: Theme.of(context)
          .textTheme
          .titleMedium
          ?.copyWith(fontWeight: FontWeight.w700),
    );
  }
}
