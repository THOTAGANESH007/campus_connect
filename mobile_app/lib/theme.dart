import 'package:flutter/material.dart';

class AppTheme {
  // CampusConnect brand colors (mirrors the React dark/indigo theme)
  static const Color primary = Color(0xFF6366F1);       // Indigo-500
  static const Color primaryDark = Color(0xFF4F46E5);   // Indigo-600
  static const Color primaryLight = Color(0xFF818CF8);  // Indigo-400
  static const Color secondary = Color(0xFF8B5CF6);     // Violet-500
  static const Color accent = Color(0xFF06B6D4);        // Cyan-500

  static const Color bgDark = Color(0xFF0F172A);        // Slate-900
  static const Color bgCard = Color(0xFF1E293B);        // Slate-800
  static const Color bgSurface = Color(0xFF334155);     // Slate-700
  static const Color bgBorder = Color(0xFF475569);      // Slate-600

  static const Color textPrimary = Color(0xFFF8FAFC);   // Slate-50
  static const Color textSecondary = Color(0xFF94A3B8); // Slate-400
  static const Color textMuted = Color(0xFF64748B);     // Slate-500

  static const Color success = Color(0xFF22C55E);       // Green-500
  static const Color warning = Color(0xFFF59E0B);       // Amber-500
  static const Color error = Color(0xFFEF4444);         // Red-500
  static const Color info = Color(0xFF3B82F6);          // Blue-500

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: primary,
        onPrimary: Colors.white,
        secondary: secondary,
        onSecondary: Colors.white,
        surface: bgCard,
        onSurface: textPrimary,
        error: error,
        onError: Colors.white,
      ),
      scaffoldBackgroundColor: bgDark,
      cardColor: bgCard,
      fontFamily: 'Inter',

      // AppBar
      appBarTheme: const AppBarTheme(
        backgroundColor: bgCard,
        foregroundColor: textPrimary,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontFamily: 'Inter',
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        iconTheme: IconThemeData(color: textPrimary),
      ),

      // Bottom Navigation
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: bgCard,
        selectedItemColor: primary,
        unselectedItemColor: textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),

      // Navigation Drawer
      drawerTheme: const DrawerThemeData(backgroundColor: bgCard),

      // Input fields
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: bgSurface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: bgBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: bgBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: error),
        ),
        labelStyle: const TextStyle(color: textSecondary),
        hintStyle: const TextStyle(color: textMuted),
        prefixIconColor: textSecondary,
      ),

      // Elevated buttons
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: const TextStyle(
            fontFamily: 'Inter',
            fontWeight: FontWeight.w600,
            fontSize: 16,
          ),
        ),
      ),

      // Text buttons
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(foregroundColor: primaryLight),
      ),

      // Cards
      cardTheme: CardThemeData(
        color: bgCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: bgBorder, width: 1),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      ),

      // Chips
      chipTheme: ChipThemeData(
        backgroundColor: bgSurface,
        selectedColor: primary.withValues(alpha: 0.3),
        labelStyle: const TextStyle(color: textSecondary, fontSize: 12),
        side: const BorderSide(color: bgBorder),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),

      // Dividers
      dividerColor: bgBorder,

      // Text
      textTheme: const TextTheme(
        displayLarge: TextStyle(color: textPrimary, fontFamily: 'Inter', fontWeight: FontWeight.w700),
        headlineLarge: TextStyle(color: textPrimary, fontFamily: 'Inter', fontWeight: FontWeight.w700),
        headlineMedium: TextStyle(color: textPrimary, fontFamily: 'Inter', fontWeight: FontWeight.w600),
        headlineSmall: TextStyle(color: textPrimary, fontFamily: 'Inter', fontWeight: FontWeight.w600),
        titleLarge: TextStyle(color: textPrimary, fontFamily: 'Inter', fontWeight: FontWeight.w600),
        titleMedium: TextStyle(color: textPrimary, fontFamily: 'Inter', fontWeight: FontWeight.w500),
        titleSmall: TextStyle(color: textSecondary, fontFamily: 'Inter'),
        bodyLarge: TextStyle(color: textPrimary, fontFamily: 'Inter'),
        bodyMedium: TextStyle(color: textSecondary, fontFamily: 'Inter'),
        bodySmall: TextStyle(color: textMuted, fontFamily: 'Inter'),
        labelLarge: TextStyle(color: textPrimary, fontFamily: 'Inter', fontWeight: FontWeight.w600),
      ),

      // FAB
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: primary,
        foregroundColor: Colors.white,
      ),

      // List Tiles
      listTileTheme: const ListTileThemeData(
        textColor: textPrimary,
        iconColor: textSecondary,
      ),

      // Icon
      iconTheme: const IconThemeData(color: textSecondary),
    );
  }

  // Status color mapping
  static Color statusColor(String status) {
    switch (status.toUpperCase()) {
      case 'PLACED':
      case 'SHORTLISTED':
        return success;
      case 'REJECTED':
        return error;
      case 'PENDING':
      case 'APPLIED':
        return warning;
      case 'UPCOMING':
        return info;
      default:
        return textSecondary;
    }
  }
}
