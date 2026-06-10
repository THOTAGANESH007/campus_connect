import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:path_provider/path_provider.dart';

class ApiService {
  static ApiService? _instance;
  late final Dio dio;
  late final PersistCookieJar _cookieJar;

  // Change to your machine's IP for real device testing
  // Android emulator: http://10.0.2.2:5000
  // Real device on LAN: http://192.168.x.x:5000
  static const String baseUrl = 'http://localhost:7777';

  ApiService._();

  static ApiService get instance {
    _instance ??= ApiService._();
    return _instance!;
  }

  Future<void> init() async {
    final appDocDir = await getApplicationDocumentsDirectory();
    _cookieJar = PersistCookieJar(
      storage: FileStorage('${appDocDir.path}/.cookies/'),
    );

    dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // This is the equivalent of withCredentials: true
        extra: {'withCredentials': true},
      ),
    );

    dio.interceptors.add(CookieManager(_cookieJar));

    // Request / Response logging in debug
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          // Ensure cookies are sent with every request
          return handler.next(options);
        },
        onError: (DioException e, handler) {
          return handler.next(e);
        },
      ),
    );
  }

  Future<void> clearCookies() async {
    await _cookieJar.deleteAll();
  }

  // ─── AUTH ────────────────────────────────────────────────
  Future<Response> signIn(String email, String password) => dio
      .post('/api/auth/signin', data: {'email': email, 'password': password});

  Future<Response> signUp(Map<String, dynamic> body) =>
      dio.post('/api/auth/signup', data: body);

  Future<Response> signOut() => dio.post('/api/auth/signout');

  Future<Response> forgotPassword(String email) =>
      dio.put('/api/auth/forgot-password', data: {'email': email});

  Future<Response> verifyOtp(String email, String otp) =>
      dio.put('/api/auth/verify-forgot-password-otp',
          data: {'email': email, 'otp': otp});

  Future<Response> resetPassword(
          String email, String otp, String newPassword) =>
      dio.put('/api/auth/reset-password',
          data: {'email': email, 'otp': otp, 'newPassword': newPassword});

  Future<Response> updateUser(Map<String, dynamic> body) =>
      dio.put('/api/auth/update-user', data: body);

  // ─── DRIVES ─────────────────────────────────────────────
  Future<Response> getDrives([Map<String, dynamic>? params]) =>
      dio.get('/api/drives', queryParameters: params);

  Future<Response> getDriveById(String id) => dio.get('/api/drives/$id');

  Future<Response> createDrive(Map<String, dynamic> body) =>
      dio.post('/api/drives', data: body);

  Future<Response> updateDrive(String id, Map<String, dynamic> body) =>
      dio.put('/api/drives/$id', data: body);

  Future<Response> deleteDrive(String id) => dio.delete('/api/drives/$id');

  // ─── APPLICATIONS ────────────────────────────────────────
  Future<Response> applyForDrive(String driveId) =>
      dio.post('/api/applications/apply/$driveId');

  Future<Response> getMyApplications() =>
      dio.get('/api/applications/my-applications');

  Future<Response> updateApplicationStatus(String appId, String status) =>
      dio.patch('/api/applications/status/$appId', data: {'status': status});

  Future<Response> getDriveApplicants(String driveId) =>
      dio.get('/api/applications/drive/$driveId');

  // ─── INTERVIEW QUESTIONS ─────────────────────────────────
  Future<Response> getInterviewQuestions([Map<String, dynamic>? params]) =>
      dio.get('/api/interview-questions', queryParameters: params);

  Future<Response> getInterviewQuestionById(String id) =>
      dio.get('/api/interview-questions/$id');

  Future<Response> createInterviewQuestion(Map<String, dynamic> body) =>
      dio.post('/api/interview-questions', data: body);

  Future<Response> deleteInterviewQuestion(String id) =>
      dio.delete('/api/interview-questions/$id');

  Future<Response> upvoteInterviewQuestion(String id) =>
      dio.put('/api/interview-questions/$id/upvote');

  Future<Response> addInterviewComment(String id, String text) =>
      dio.post('/api/interview-questions/$id/comments', data: {'text': text});

  Future<Response> deleteInterviewComment(String qId, String cId) =>
      dio.delete('/api/interview-questions/$qId/comments/$cId');

  // ─── MATERIALS ───────────────────────────────────────────
  Future<Response> getMaterials([Map<String, dynamic>? params]) =>
      dio.get('/api/placement-materials', queryParameters: params);

  Future<Response> createMaterial(FormData formData) =>
      dio.post('/api/placement-materials', data: formData);

  Future<Response> upvoteMaterial(String id) =>
      dio.put('/api/placement-materials/$id/upvote');

  Future<Response> incrementDownload(String id) =>
      dio.put('/api/placement-materials/$id/download');

  Future<Response> deleteMaterial(String id) =>
      dio.delete('/api/placement-materials/$id');

  // ─── FORUM ───────────────────────────────────────────────
  Future<Response> getForumPosts([Map<String, dynamic>? params]) =>
      dio.get('/api/forum', queryParameters: params);

  Future<Response> getForumPostById(String id) => dio.get('/api/forum/$id');

  Future<Response> createForumPost(Map<String, dynamic> body) =>
      dio.post('/api/forum', data: body);

  Future<Response> addForumComment(String id, String content) =>
      dio.post('/api/forum/$id/comment', data: {'content': content});

  Future<Response> upvoteForumPost(String id) =>
      dio.patch('/api/forum/$id/upvote');

  Future<Response> deleteForumPost(String id) => dio.delete('/api/forum/$id');

  // ─── PROFILE ─────────────────────────────────────────────
  Future<Response> getMyProfile() => dio.get('/api/profile/me');

  Future<Response> updateProfile(Map<String, dynamic> body) =>
      dio.put('/api/profile/update', data: body);

  Future<Response> uploadResume(FormData formData) =>
      dio.put('/api/profile/upload-resume', data: formData);

  Future<Response> uploadProfilePic(FormData formData) =>
      dio.put('/api/auth/upload-profile', data: formData);

  Future<Response> toggleBookmark(String type, String id) =>
      dio.post('/api/profile/bookmark/$type/$id');

  Future<Response> getBookmarks() => dio.get('/api/profile/bookmarks');

  // ─── ANALYTICS ──────────────────────────────────────────
  Future<Response> getAnalyticsOverview() => dio.get('/api/analytics/overview');

  Future<Response> getAnalyticsByCompany() =>
      dio.get('/api/analytics/by-company');

  Future<Response> getAnalyticsByBranch() =>
      dio.get('/api/analytics/by-branch');

  Future<Response> getStatusDistribution() =>
      dio.get('/api/analytics/status-distribution');

  // ─── AI CHAT ────────────────────────────────────────────
  Future<Response> sendChatMessage(List<Map<String, dynamic>> history) =>
      dio.post('/api/chat', data: {'history': history});

  // ─── RESUME ANALYZER ────────────────────────────────────
  Future<Response> analyzeResume(FormData formData) =>
      dio.post('/api/resume/analyze', data: formData);

  // ─── NOTIFICATIONS ──────────────────────────────────────
  Future<Response> getNotifications() => dio.get('/api/notifications');

  Future<Response> markNotificationRead(String id) =>
      dio.patch('/api/notifications/mark-read/$id');

  Future<Response> markAllNotificationsRead() =>
      dio.patch('/api/notifications/mark-all-read');
}
