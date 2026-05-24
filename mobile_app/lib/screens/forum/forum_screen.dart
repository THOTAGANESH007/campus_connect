import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../models/forum_model.dart';
import '../../theme.dart';

class ForumScreen extends StatefulWidget {
  const ForumScreen({super.key});

  @override
  State<ForumScreen> createState() => _ForumScreenState();
}

class _ForumScreenState extends State<ForumScreen> {
  List<ForumPost> _posts = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchPosts();
  }

  Future<void> _fetchPosts() async {
    setState(() => _loading = true);
    try {
      final res = await ApiService.instance.getForumPosts();
      final list = res.data is List ? res.data : (res.data['posts'] ?? res.data['data'] ?? []);
      _posts = (list as List)
          .map((e) => ForumPost.fromJson(Map<String, dynamic>.from(e)))
          .toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    setState(() => _loading = false);
  }

  Future<void> _upvote(String id) async {
    try {
      await ApiService.instance.upvoteForumPost(id);
      _fetchPosts();
    } catch (_) {}
  }

  void _showCreateDialog() {
    final titleCtrl = TextEditingController();
    final contentCtrl = TextEditingController();
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
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('New Discussion',
                  style: Theme.of(ctx).textTheme.titleLarge),
              const SizedBox(height: 16),
              TextField(
                  controller: titleCtrl,
                  decoration: const InputDecoration(
                      labelText: 'Title',
                      prefixIcon: Icon(Icons.title_rounded))),
              const SizedBox(height: 12),
              TextField(
                  controller: contentCtrl,
                  maxLines: 4,
                  decoration:
                      const InputDecoration(labelText: 'Content (Markdown supported)')),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () async {
                  if (titleCtrl.text.isEmpty || contentCtrl.text.isEmpty)
                    return;
                  try {
                    await ApiService.instance.createForumPost({
                      'title': titleCtrl.text.trim(),
                      'content': contentCtrl.text.trim(),
                    });
                    if (ctx.mounted) Navigator.pop(ctx);
                    _fetchPosts();
                  } catch (_) {}
                },
                child: const Text('Post'),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showPostDetail(ForumPost post) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => _ForumPostDetail(post: post)),
    ).then((_) => _fetchPosts());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Community Forum')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showCreateDialog,
        icon: const Icon(Icons.edit_rounded),
        label: const Text('New Post'),
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
                        onPressed: _fetchPosts, child: const Text('Retry')),
                  ],
                ))
              : RefreshIndicator(
                  onRefresh: _fetchPosts,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: _posts.length,
                    itemBuilder: (_, i) {
                      final post = _posts[i];
                      return Card(
                        child: InkWell(
                          onTap: () => _showPostDetail(post),
                          borderRadius: BorderRadius.circular(16),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(post.title,
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleMedium
                                        ?.copyWith(
                                            fontWeight: FontWeight.w700)),
                                const SizedBox(height: 6),
                                Text(post.content,
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                    style: Theme.of(context)
                                        .textTheme
                                        .bodyMedium),
                                if (post.tags.isNotEmpty) ...[
                                  const SizedBox(height: 8),
                                  Wrap(
                                    spacing: 6,
                                    children: post.tags
                                        .take(3)
                                        .map((t) => Chip(
                                            label: Text(t,
                                                style: const TextStyle(
                                                    fontSize: 11)),
                                            padding: EdgeInsets.zero,
                                            materialTapTargetSize:
                                                MaterialTapTargetSize
                                                    .shrinkWrap))
                                        .toList(),
                                  ),
                                ],
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    InkWell(
                                      onTap: () => _upvote(post.id),
                                      child: Row(children: [
                                        const Icon(Icons.thumb_up_outlined,
                                            size: 14,
                                            color: AppTheme.primaryLight),
                                        const SizedBox(width: 4),
                                        Text('${post.upvotes.length}',
                                            style: const TextStyle(
                                                color: AppTheme.primaryLight,
                                                fontSize: 12)),
                                      ]),
                                    ),
                                    const SizedBox(width: 14),
                                    const Icon(Icons.comment_outlined,
                                        size: 14, color: AppTheme.textMuted),
                                    const SizedBox(width: 4),
                                    Text('${post.comments.length}',
                                        style: const TextStyle(
                                            color: AppTheme.textMuted,
                                            fontSize: 12)),
                                    const Spacer(),
                                    Text(
                                      post.author?['name'] ?? 'Anonymous',
                                      style: const TextStyle(
                                          color: AppTheme.textMuted,
                                          fontSize: 11),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}

// ─── Forum Post Detail ────────────────────────────────────────────────────────
class _ForumPostDetail extends StatefulWidget {
  final ForumPost post;
  const _ForumPostDetail({required this.post});

  @override
  State<_ForumPostDetail> createState() => _ForumPostDetailState();
}

class _ForumPostDetailState extends State<_ForumPostDetail> {
  late ForumPost _post;
  final _commentCtrl = TextEditingController();
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _post = widget.post;
    _loadFull();
  }

  @override
  void dispose() {
    _commentCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadFull() async {
    try {
      final res = await ApiService.instance.getForumPostById(_post.id);
      final data = res.data is Map
          ? (res.data['post'] ?? res.data)
          : res.data;
      setState(() => _post = ForumPost.fromJson(Map<String, dynamic>.from(data)));
    } catch (_) {}
  }

  Future<void> _addComment() async {
    if (_commentCtrl.text.isEmpty) return;
    setState(() => _submitting = true);
    try {
      await ApiService.instance.addForumComment(_post.id, _commentCtrl.text.trim());
      _commentCtrl.clear();
      _loadFull();
    } catch (_) {}
    setState(() => _submitting = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_post.title, overflow: TextOverflow.ellipsis)),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_post.title,
                      style: Theme.of(context)
                          .textTheme
                          .headlineSmall
                          ?.copyWith(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 12),
                  Text(_post.content,
                      style: Theme.of(context).textTheme.bodyLarge),
                  const SizedBox(height: 16),
                  const Divider(),
                  Text('${_post.comments.length} Comments',
                      style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  ..._post.comments.map((c) => Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppTheme.bgSurface,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              c.author?['name'] ?? 'Anonymous',
                              style: const TextStyle(
                                  color: AppTheme.primaryLight,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 13),
                            ),
                            const SizedBox(height: 4),
                            Text(c.content,
                                style: Theme.of(context).textTheme.bodyMedium),
                          ],
                        ),
                      )),
                ],
              ),
            ),
          ),
          // Comment box
          Container(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 16),
            decoration: const BoxDecoration(
              color: AppTheme.bgCard,
              border: Border(top: BorderSide(color: AppTheme.bgBorder)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _commentCtrl,
                    decoration: const InputDecoration(
                      hintText: 'Add a comment...',
                      contentPadding: EdgeInsets.symmetric(
                          horizontal: 14, vertical: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  style: IconButton.styleFrom(
                      backgroundColor: AppTheme.primary,
                      foregroundColor: Colors.white),
                  icon: _submitting
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white))
                      : const Icon(Icons.send_rounded),
                  onPressed: _submitting ? null : _addComment,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
