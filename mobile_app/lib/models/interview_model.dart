class InterviewQuestion {
  final String id;
  final String company;
  final String role;
  final String question;
  final String? answer;
  final List<String> tags;
  final String difficulty;
  final List<String> upvotes;
  final List<Map<String, dynamic>> comments;
  final Map<String, dynamic>? postedBy;
  final String? createdAt;

  InterviewQuestion({
    required this.id,
    required this.company,
    required this.role,
    required this.question,
    this.answer,
    required this.tags,
    required this.difficulty,
    required this.upvotes,
    required this.comments,
    this.postedBy,
    this.createdAt,
  });

  factory InterviewQuestion.fromJson(Map<String, dynamic> json) {
    return InterviewQuestion(
      id: json['_id'] ?? json['id'] ?? '',
      company: json['company'] ?? '',
      role: json['role'] ?? '',
      question: json['question'] ?? '',
      answer: json['answer'],
      tags: (json['tags'] as List?)?.map((e) => e.toString()).toList() ?? [],
      difficulty: json['difficulty'] ?? 'MEDIUM',
      upvotes: (json['upvotes'] as List?)?.map((e) => e.toString()).toList() ?? [],
      comments: (json['comments'] as List?)
              ?.map((e) => Map<String, dynamic>.from(e))
              .toList() ??
          [],
      postedBy: json['postedBy'] is Map ? Map<String, dynamic>.from(json['postedBy']) : null,
      createdAt: json['createdAt'],
    );
  }
}

class ApplicationModel {
  final String id;
  final String driveId;
  final String? company;
  final String? role;
  final String status;
  final String? appliedAt;
  final Map<String, dynamic>? drive;

  ApplicationModel({
    required this.id,
    required this.driveId,
    this.company,
    this.role,
    required this.status,
    this.appliedAt,
    this.drive,
  });

  factory ApplicationModel.fromJson(Map<String, dynamic> json) {
    final driveData = json['drive'] is Map ? Map<String, dynamic>.from(json['drive']) : null;
    return ApplicationModel(
      id: json['_id'] ?? json['id'] ?? '',
      driveId: driveData?['_id'] ?? json['driveId'] ?? '',
      company: driveData?['company'] ?? json['company'],
      role: driveData?['role'] ?? json['role'],
      status: json['status'] ?? 'APPLIED',
      appliedAt: json['appliedAt'] ?? json['createdAt'],
      drive: driveData,
    );
  }
}
