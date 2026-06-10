class ForumPost {
  final String id;
  final String title;
  final String content;
  final List<String> tags;
  final List<String> upvotes;
  final List<CommentModel> comments;
  final Map<String, dynamic>? author;
  final String? createdAt;

  ForumPost({
    required this.id,
    required this.title,
    required this.content,
    required this.tags,
    required this.upvotes,
    required this.comments,
    this.author,
    this.createdAt,
  });

  factory ForumPost.fromJson(Map<String, dynamic> json) {
    return ForumPost(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      tags: (json['tags'] as List?)?.map((e) => e.toString()).toList() ?? [],
      upvotes: (json['upvotes'] as List?)?.map((e) => e.toString()).toList() ?? [],
      comments: (json['comments'] as List?)
              ?.map((e) => CommentModel.fromJson(Map<String, dynamic>.from(e)))
              .toList() ??
          [],
      author: json['author'] is Map ? Map<String, dynamic>.from(json['author']) : null,
      createdAt: json['createdAt'],
    );
  }
}

class CommentModel {
  final String id;
  final String content;
  final Map<String, dynamic>? author;
  final String? createdAt;

  CommentModel({
    required this.id,
    required this.content,
    this.author,
    this.createdAt,
  });

  factory CommentModel.fromJson(Map<String, dynamic> json) {
    return CommentModel(
      id: json['_id'] ?? json['id'] ?? '',
      content: json['content'] ?? json['text'] ?? '',
      author: json['author'] is Map ? Map<String, dynamic>.from(json['author']) : null,
      createdAt: json['createdAt'],
    );
  }
}
