class MaterialModel {
  final String id;
  final String title;
  final String? description;
  final String? type;
  final List<String> tags;
  final String? resourceUrl;
  final List<String> upvotes;
  final int downloadCount;
  final Map<String, dynamic>? sharedBy;
  final String? createdAt;

  MaterialModel({
    required this.id,
    required this.title,
    this.description,
    this.type,
    required this.tags,
    this.resourceUrl,
    required this.upvotes,
    required this.downloadCount,
    this.sharedBy,
    this.createdAt,
  });

  factory MaterialModel.fromJson(Map<String, dynamic> json) {
    return MaterialModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'],
      type: json['type'],
      tags: (json['tags'] as List?)?.map((e) => e.toString()).toList() ?? [],
      resourceUrl: json['resourceUrl'] ?? json['fileUrl'],
      upvotes: (json['upvotes'] as List?)?.map((e) => e.toString()).toList() ?? [],
      downloadCount: json['downloadCount'] ?? 0,
      sharedBy: json['sharedBy'] is Map ? Map<String, dynamic>.from(json['sharedBy']) : null,
      createdAt: json['createdAt'],
    );
  }
}
