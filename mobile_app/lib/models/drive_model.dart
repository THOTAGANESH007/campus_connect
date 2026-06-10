class DriveModel {
  final String id;
  final String company;
  final String role;
  final String? description;
  final String? jobType;
  final double? package;
  final DateTime? deadline;
  final String? status;
  final List<String>? eligibleBranches;
  final double? minGpa;
  final String? registrationLink;
  final List<Map<String, dynamic>>? selectionRounds;
  final List<Map<String, dynamic>>? timeline;
  final String? createdAt;

  DriveModel({
    required this.id,
    required this.company,
    required this.role,
    this.description,
    this.jobType,
    this.package,
    this.deadline,
    this.status,
    this.eligibleBranches,
    this.minGpa,
    this.registrationLink,
    this.selectionRounds,
    this.timeline,
    this.createdAt,
  });

  factory DriveModel.fromJson(Map<String, dynamic> json) {
    return DriveModel(
      id: json['_id'] ?? json['id'] ?? '',
      company: json['company'] ?? '',
      role: json['role'] ?? '',
      description: json['description'],
      jobType: json['jobType'],
      package: (json['package'] as num?)?.toDouble(),
      deadline: json['deadline'] != null ? DateTime.tryParse(json['deadline']) : null,
      status: json['status'],
      eligibleBranches: (json['eligibleBranches'] as List?)?.map((e) => e.toString()).toList(),
      minGpa: (json['minGpa'] as num?)?.toDouble(),
      registrationLink: json['registrationLink'],
      selectionRounds: (json['selectionRounds'] as List?)?.map((e) => Map<String, dynamic>.from(e)).toList(),
      timeline: (json['timeline'] as List?)?.map((e) => Map<String, dynamic>.from(e)).toList(),
      createdAt: json['createdAt'],
    );
  }
}
