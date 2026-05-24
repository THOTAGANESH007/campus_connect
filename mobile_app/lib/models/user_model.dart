class UserModel {
  final String id;
  final String name;
  final String email;
  final String role; // STUDENT | PLACEMENT_OFFICER | ADMIN
  final String? branch;
  final String? rollNumber;
  final String? profilePic; // backend sends as 'profile'
  final String? phone;
  final double? cgpa;
  final List<String> skills;
  final String? resume; // cloudinary URL
  final int? year;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.branch,
    this.rollNumber,
    this.profilePic,
    this.phone,
    this.cgpa,
    this.skills = const [],
    this.resume,
    this.year,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'STUDENT',
      branch: json['branch'],
      rollNumber: json['rollNumber'],
      // backend stores as 'profile', some responses also use 'profilePic'
      profilePic: json['profile'] ?? json['profilePic'],
      phone: json['phone'],
      cgpa: (json['cgpa'] as num?)?.toDouble(),
      skills: (json['skills'] as List?)
              ?.map((s) => s.toString())
              .toList() ??
          [],
      resume: json['resume'],
      year: json['year'],
    );
  }

  Map<String, dynamic> toJson() => {
        '_id': id,
        'name': name,
        'email': email,
        'role': role,
        'branch': branch,
        'rollNumber': rollNumber,
        'profile': profilePic,
        'phone': phone,
        'cgpa': cgpa,
        'skills': skills,
        'resume': resume,
        'year': year,
      };

  bool get isOfficer => role == 'PLACEMENT_OFFICER' || role == 'ADMIN';
  bool get isAdmin => role == 'ADMIN';

  /// Profile completeness % (0–100)
  int get completenessPercent {
    int filled = 0;
    const total = 6;
    if (name.isNotEmpty) filled++;
    if (phone != null && phone!.isNotEmpty) filled++;
    if (cgpa != null) filled++;
    if (branch != null && branch!.isNotEmpty) filled++;
    if (skills.isNotEmpty) filled++;
    if (resume != null && resume!.isNotEmpty) filled++;
    return ((filled / total) * 100).round();
  }
}
