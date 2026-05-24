import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

enum AuthStatus { initial, authenticated, unauthenticated }

class AuthProvider extends ChangeNotifier {
  AuthStatus _status = AuthStatus.initial;
  UserModel? _user;
  String? _error;
  bool _loading = false;

  AuthStatus get status => _status;
  UserModel? get user => _user;
  String? get error => _error;
  bool get loading => _loading;
  bool get isLoggedIn => _status == AuthStatus.authenticated;
  bool get isOfficer => _user?.isOfficer ?? false;

  void _setLoading(bool val) {
    _loading = val;
    notifyListeners();
  }

  void _setError(String? msg) {
    _error = msg;
    notifyListeners();
  }

  // Called on app start to rehydrate session from cookie
  Future<void> tryAutoLogin() async {
    try {
      final response = await ApiService.instance.getMyProfile();
      if (response.statusCode == 200) {
        final data = response.data;
        // /api/profile/me returns the user directly, not wrapped
        _user = UserModel.fromJson(
            data is Map ? Map<String, dynamic>.from(data) : {});
        _status = AuthStatus.authenticated;
      } else {
        _status = AuthStatus.unauthenticated;
      }
    } catch (_) {
      _status = AuthStatus.unauthenticated;
    }
    notifyListeners();
  }

  Future<bool> signIn(String email, String password) async {
    _setLoading(true);
    _setError(null);
    try {
      final response = await ApiService.instance.signIn(email, password);
      if (response.statusCode == 200) {
        final data = response.data;
        final userData = data['user'] ?? data;
        _user = UserModel.fromJson(userData is Map ? Map<String, dynamic>.from(userData) : {});
        _status = AuthStatus.authenticated;
        _setLoading(false);
        return true;
      }
    } catch (e) {
      _setError(_parseError(e));
    }
    _setLoading(false);
    return false;
  }

  Future<bool> signUp(Map<String, dynamic> body) async {
    _setLoading(true);
    _setError(null);
    try {
      final response = await ApiService.instance.signUp(body);
      if (response.statusCode == 201 || response.statusCode == 200) {
        _setLoading(false);
        return true;
      }
    } catch (e) {
      _setError(_parseError(e));
    }
    _setLoading(false);
    return false;
  }

  Future<void> signOut() async {
    try {
      await ApiService.instance.signOut();
    } catch (_) {}
    await ApiService.instance.clearCookies();
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    _user = null;
    _status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  Future<String?> forgotPassword(String email) async {
    _setLoading(true);
    try {
      await ApiService.instance.forgotPassword(email);
      _setLoading(false);
      return null;
    } catch (e) {
      _setLoading(false);
      return _parseError(e);
    }
  }

  Future<String?> verifyOtp(String email, String otp) async {
    _setLoading(true);
    try {
      await ApiService.instance.verifyOtp(email, otp);
      _setLoading(false);
      return null;
    } catch (e) {
      _setLoading(false);
      return _parseError(e);
    }
  }

  Future<String?> resetPassword(String email, String otp, String newPassword) async {
    _setLoading(true);
    try {
      await ApiService.instance.resetPassword(email, otp, newPassword);
      _setLoading(false);
      return null;
    } catch (e) {
      _setLoading(false);
      return _parseError(e);
    }
  }

  Future<void> refreshUser() async {
    try {
      final response = await ApiService.instance.getMyProfile();
      final data = response.data;
      // /api/profile/me returns user object directly
      _user = UserModel.fromJson(
          data is Map ? Map<String, dynamic>.from(data) : {});
      notifyListeners();
    } catch (_) {}
  }

  String _parseError(dynamic e) {
    if (e.runtimeType.toString().contains('DioException')) {
      final data = (e as dynamic).response?.data;
      if (data is Map) return data['message'] ?? data['error'] ?? 'Request failed';
    }
    return e.toString();
  }
}
