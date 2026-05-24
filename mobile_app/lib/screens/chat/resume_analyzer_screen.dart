import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:dio/dio.dart';
import 'package:percent_indicator/percent_indicator.dart';
import '../../services/api_service.dart';
import '../../theme.dart';

class ResumeAnalyzerScreen extends StatefulWidget {
  const ResumeAnalyzerScreen({super.key});

  @override
  State<ResumeAnalyzerScreen> createState() => _ResumeAnalyzerScreenState();
}

class _ResumeAnalyzerScreenState extends State<ResumeAnalyzerScreen> {
  PlatformFile? _file;
  bool _loading = false;
  Map<String, dynamic>? _result;
  String? _error;

  Future<void> _pickFile() async {
    final res = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );
    if (res != null) {
      setState(() {
        _file = res.files.first;
        _result = null;
        _error = null;
      });
    }
  }

  Future<void> _analyze() async {
    if (_file == null || _file?.path == null) return;
    setState(() {
      _loading = true;
      _error = null;
      _result = null;
    });
    try {
      final formData = FormData.fromMap({
        'resume': await MultipartFile.fromFile(
          _file!.path!,
          filename: _file!.name,
        ),
      });
      final response = await ApiService.instance.analyzeResume(formData);
      setState(() => _result = Map<String, dynamic>.from(response.data));
    } catch (e) {
      final data = (e as dynamic).response?.data;
      setState(() =>
          _error = data is Map ? data['message'] ?? 'Analysis failed' : 'Analysis failed');
    }
    setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('ATS Resume Analyzer')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1E1B4B), AppTheme.bgCard],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.bgBorder),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.primary.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.document_scanner_rounded,
                        color: AppTheme.primaryLight, size: 32),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Resume ATS Analyzer',
                            style: Theme.of(context).textTheme.titleLarge),
                        const SizedBox(height: 4),
                        Text(
                          'Upload your PDF resume to get an ATS score and personalized feedback.',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Upload zone
            GestureDetector(
              onTap: _pickFile,
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppTheme.bgCard,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: _file != null
                        ? AppTheme.primary
                        : AppTheme.bgBorder,
                    width: _file != null ? 2 : 1,
                  ),
                ),
                child: Column(
                  children: [
                    Icon(
                      _file != null
                          ? Icons.check_circle_rounded
                          : Icons.upload_file_rounded,
                      size: 48,
                      color: _file != null
                          ? AppTheme.success
                          : AppTheme.textMuted,
                    ),
                    const SizedBox(height: 10),
                    Text(
                      _file != null
                          ? _file!.name
                          : 'Tap to select your PDF resume',
                      style: TextStyle(
                        color: _file != null
                            ? AppTheme.textPrimary
                            : AppTheme.textMuted,
                        fontSize: 15,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    if (_file != null)
                      Text(
                        '${(_file!.size / 1024).toStringAsFixed(1)} KB',
                        style: const TextStyle(
                            color: AppTheme.textMuted, fontSize: 12),
                      ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            if (_file != null)
              ElevatedButton.icon(
                onPressed: _loading ? null : _analyze,
                icon: _loading
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.white))
                    : const Icon(Icons.analytics_outlined),
                label: Text(_loading ? 'Analyzing...' : 'Analyze Resume'),
              ),

            if (_error != null) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppTheme.error.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.error.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline,
                        color: AppTheme.error, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                        child: Text(_error!,
                            style: const TextStyle(color: AppTheme.error))),
                  ],
                ),
              ),
            ],

            // Results
            if (_result != null) ...[
              const SizedBox(height: 24),

              // ATS Score ring
              Center(
                child: CircularPercentIndicator(
                  radius: 90,
                  lineWidth: 14,
                  percent: ((_result!['score'] ?? 0) as num) / 100,
                  center: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '${_result!['score']}',
                        style: const TextStyle(
                            color: AppTheme.textPrimary,
                            fontSize: 36,
                            fontWeight: FontWeight.w800),
                      ),
                      const Text('ATS Score',
                          style: TextStyle(
                              color: AppTheme.textMuted, fontSize: 12)),
                    ],
                  ),
                  progressColor: _scoreColor(
                      (_result!['score'] ?? 0) as num),
                  backgroundColor: AppTheme.bgSurface,
                  circularStrokeCap: CircularStrokeCap.round,
                  animation: true,
                  animationDuration: 1000,
                ),
              ),

              const SizedBox(height: 20),

              // Summary
              if (_result!['summary'] != null)
                _ResultCard(
                  title: 'Profile Summary',
                  icon: Icons.person_outline,
                  child: Text(_result!['summary'],
                      style: Theme.of(context).textTheme.bodyMedium),
                ),

              // Skills
              if (_result!['skills'] != null &&
                  (_result!['skills'] as List).isNotEmpty)
                _ResultCard(
                  title: 'Detected Skills',
                  icon: Icons.code_rounded,
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: (_result!['skills'] as List)
                        .map((s) => Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(
                                color: AppTheme.primary.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                    color: AppTheme.primary.withOpacity(0.3)),
                              ),
                              child: Text(s.toString(),
                                  style: const TextStyle(
                                      color: AppTheme.primaryLight,
                                      fontSize: 12)),
                            ))
                        .toList(),
                  ),
                ),

              // Recommended Roles
              if (_result!['recommendedRoles'] != null &&
                  (_result!['recommendedRoles'] as List).isNotEmpty)
                _ResultCard(
                  title: 'Recommended Roles',
                  icon: Icons.work_outline,
                  child: Column(
                    children: (_result!['recommendedRoles'] as List)
                        .map((r) => Padding(
                              padding: const EdgeInsets.only(bottom: 6),
                              child: Row(
                                children: [
                                  const Icon(Icons.arrow_right_rounded,
                                      color: AppTheme.success, size: 18),
                                  const SizedBox(width: 6),
                                  Text(r.toString(),
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium),
                                ],
                              ),
                            ))
                        .toList(),
                  ),
                ),

              // Suggestions
              if (_result!['suggestions'] != null &&
                  (_result!['suggestions'] as List).isNotEmpty)
                _ResultCard(
                  title: 'Improvement Suggestions',
                  icon: Icons.tips_and_updates_outlined,
                  child: Column(
                    children: (_result!['suggestions'] as List)
                        .map((s) => Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Padding(
                                    padding: EdgeInsets.only(top: 2),
                                    child: Icon(Icons.warning_amber_rounded,
                                        color: AppTheme.warning, size: 16),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                      child: Text(s.toString(),
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium)),
                                ],
                              ),
                            ))
                        .toList(),
                  ),
                ),
            ],

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Color _scoreColor(num score) {
    if (score >= 75) return AppTheme.success;
    if (score >= 50) return AppTheme.warning;
    return AppTheme.error;
  }
}

class _ResultCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Widget child;
  const _ResultCard(
      {required this.title, required this.icon, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
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
            Icon(icon, color: AppTheme.primaryLight, size: 18),
            const SizedBox(width: 8),
            Text(title,
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(color: AppTheme.primaryLight)),
          ]),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}
