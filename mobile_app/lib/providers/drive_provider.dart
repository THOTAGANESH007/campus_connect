import 'package:flutter/material.dart';
import '../models/drive_model.dart';
import '../services/api_service.dart';

class DriveProvider extends ChangeNotifier {
  List<DriveModel> _drives = [];
  DriveModel? _selectedDrive;
  bool _loading = false;
  String? _error;

  List<DriveModel> get drives => _drives;
  DriveModel? get selectedDrive => _selectedDrive;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> fetchDrives({String? search, String? jobType, String? branch}) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final params = <String, dynamic>{};
      if (search != null && search.isNotEmpty) params['company'] = search;
      if (jobType != null && jobType.isNotEmpty) params['jobType'] = jobType;
      if (branch != null && branch.isNotEmpty) params['branch'] = branch;

      final res = await ApiService.instance.getDrives(params);
      final list = res.data is List ? res.data : (res.data['drives'] ?? res.data['data'] ?? []);
      _drives = (list as List).map((e) => DriveModel.fromJson(Map<String, dynamic>.from(e))).toList();
    } catch (e) {
      _error = e.toString();
    }
    _loading = false;
    notifyListeners();
  }

  Future<void> fetchDriveById(String id) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final res = await ApiService.instance.getDriveById(id);
      final data = res.data is Map ? res.data['drive'] ?? res.data : res.data;
      _selectedDrive = DriveModel.fromJson(Map<String, dynamic>.from(data));
    } catch (e) {
      _error = e.toString();
    }
    _loading = false;
    notifyListeners();
  }

  Future<bool> applyForDrive(String driveId) async {
    try {
      await ApiService.instance.applyForDrive(driveId);
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> deleteDrive(String id) async {
    try {
      await ApiService.instance.deleteDrive(id);
      _drives.removeWhere((d) => d.id == id);
      notifyListeners();
      return true;
    } catch (_) {
      return false;
    }
  }
}
