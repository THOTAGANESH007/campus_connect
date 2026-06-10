import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../models/interview_model.dart';
import '../../theme.dart';

class InterviewQAScreen extends StatefulWidget {
  const InterviewQAScreen({super.key});

  @override
  State<InterviewQAScreen> createState() => _InterviewQAScreenState();
}

class _InterviewQAScreenState extends State<InterviewQAScreen> {
  List<InterviewQuestion> _questions = [];
  bool _loading = true;
  String? _error;
  final _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchQuestions();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _fetchQuestions() async {
    setState(() => _loading = true);
    try {
      final res = await ApiService.instance.getInterviewQuestions();
      final list = res.data is List
          ? res.data
          : (res.data['questions'] ?? res.data['data'] ?? []);
      _questions = (list as List)
          .map((e) => InterviewQuestion.fromJson(Map<String, dynamic>.from(e)))
          .toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    setState(() => _loading = false);
  }

  Future<void> _upvote(String id) async {
    try {
      await ApiService.instance.upvoteInterviewQuestion(id);
      _fetchQuestions();
    } catch (_) {}
  }

  void _showCreateDialog() {
    final companyCtrl = TextEditingController();
    final roleCtrl = TextEditingController();
    final questionCtrl = TextEditingController();
    final answerCtrl = TextEditingController();
    String difficulty = 'MEDIUM';
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
                  Text('Share Interview Experience',
                      style: Theme.of(ctx2).textTheme.titleLarge),
                  const SizedBox(height: 16),
                  TextField(
                      controller: companyCtrl,
                      decoration: const InputDecoration(
                          labelText: 'Company',
                          prefixIcon: Icon(Icons.business_outlined))),
                  const SizedBox(height: 12),
                  TextField(
                      controller: roleCtrl,
                      decoration: const InputDecoration(
                          labelText: 'Role',
                          prefixIcon: Icon(Icons.work_outline))),
                  const SizedBox(height: 12),
                  TextField(
                      controller: questionCtrl,
                      maxLines: 3,
                      decoration: const InputDecoration(
                          labelText: 'Question / Experience')),
                  const SizedBox(height: 12),
                  TextField(
                      controller: answerCtrl,
                      maxLines: 3,
                      decoration:
                          const InputDecoration(labelText: 'Answer / Tips')),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: difficulty,
                    dropdownColor: AppTheme.bgCard,
                    decoration: const InputDecoration(labelText: 'Difficulty'),
                    items: ['EASY', 'MEDIUM', 'HARD']
                        .map((d) => DropdownMenuItem(
                            value: d,
                            child: Text(d,
                                style: const TextStyle(
                                    color: AppTheme.textPrimary))))
                        .toList(),
                    onChanged: (v) => sb(() => difficulty = v!),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () async {
                      if (companyCtrl.text.isEmpty || questionCtrl.text.isEmpty)
                        return;
                      try {
                        await ApiService.instance.createInterviewQuestion({
                          'company': companyCtrl.text.trim(),
                          'role': roleCtrl.text.trim(),
                          'question': questionCtrl.text.trim(),
                          'answer': answerCtrl.text.trim(),
                          'difficulty': difficulty,
                        });
                        if (ctx.mounted) Navigator.pop(ctx);
                        _fetchQuestions();
                      } catch (e) {
                        if (ctx.mounted) {
                          ScaffoldMessenger.of(ctx).showSnackBar(const SnackBar(
                              content: Text('Failed to post'),
                              behavior: SnackBarBehavior.floating));
                        }
                      }
                    },
                    child: const Text('Submit'),
                  ),
                ],
              ),
            );
          }),
        );
      },
    );
  }

  Color _difficultyColor(String d) {
    switch (d.toUpperCase()) {
      case 'EASY':
        return AppTheme.success;
      case 'HARD':
        return AppTheme.error;
      default:
        return AppTheme.warning;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Interview Q&A')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showCreateDialog,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Share'),
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
                        onPressed: _fetchQuestions, child: const Text('Retry')),
                  ],
                ))
              : RefreshIndicator(
                  onRefresh: _fetchQuestions,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: _questions.length,
                    itemBuilder: (_, i) {
                      final q = _questions[i];
                      return Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(q.company,
                                        style: Theme.of(context)
                                            .textTheme
                                            .titleMedium
                                            ?.copyWith(
                                                color: AppTheme.primaryLight,
                                                fontWeight: FontWeight.w700)),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: _difficultyColor(q.difficulty)
                                          .withOpacity(0.15),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(q.difficulty,
                                        style: TextStyle(
                                            color:
                                                _difficultyColor(q.difficulty),
                                            fontSize: 11)),
                                  ),
                                ],
                              ),
                              Text(q.role,
                                  style:
                                      Theme.of(context).textTheme.bodyMedium),
                              const SizedBox(height: 10),
                              Text(q.question,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyLarge
                                      ?.copyWith(fontWeight: FontWeight.w500)),
                              if (q.answer != null && q.answer!.isNotEmpty) ...[
                                const SizedBox(height: 8),
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: AppTheme.bgSurface,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(q.answer!,
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium),
                                ),
                              ],
                              const SizedBox(height: 10),
                              Row(
                                children: [
                                  InkWell(
                                    onTap: () => _upvote(q.id),
                                    borderRadius: BorderRadius.circular(8),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 10, vertical: 6),
                                      decoration: BoxDecoration(
                                        color:
                                            AppTheme.primary.withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Row(
                                        children: [
                                          const Icon(Icons.thumb_up_outlined,
                                              size: 15,
                                              color: AppTheme.primaryLight),
                                          const SizedBox(width: 4),
                                          Text('${q.upvotes.length}',
                                              style: const TextStyle(
                                                  color: AppTheme.primaryLight,
                                                  fontSize: 12)),
                                        ],
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Icon(Icons.comment_outlined,
                                      size: 14, color: AppTheme.textMuted),
                                  const SizedBox(width: 4),
                                  Text('${q.comments.length}',
                                      style: const TextStyle(
                                          color: AppTheme.textMuted,
                                          fontSize: 12)),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
