import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme.dart';
import 'drives/drive_list_screen.dart';
import 'profile/my_applications_screen.dart';
import 'materials/materials_screen.dart';
import 'profile/profile_screen.dart';
import 'analytics/analytics_screen.dart';
import '../widgets/app_drawer.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  /// Exposed via Provider so child tab screens can call openDrawer()
  /// on THIS scaffold (not their own nested Scaffold).
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  // ── STUDENT ────────────────────────────────────────
  static const _studentPages = <Widget>[
    DriveListScreen(),
    MyApplicationsScreen(),
    MaterialsScreen(),
    ProfileScreen(),
  ];

  static const _studentNavItems = <BottomNavigationBarItem>[
    BottomNavigationBarItem(
      icon: Icon(Icons.work_outline_rounded),
      activeIcon: Icon(Icons.work_rounded),
      label: 'Drives',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.assignment_outlined),
      activeIcon: Icon(Icons.assignment_rounded),
      label: 'My Apps',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.library_books_outlined),
      activeIcon: Icon(Icons.library_books_rounded),
      label: 'Materials',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.person_outline_rounded),
      activeIcon: Icon(Icons.person_rounded),
      label: 'Profile',
    ),
  ];

  // ── OFFICER / ADMIN ───────────────────────────────
  static const _officerPages = <Widget>[
    DriveListScreen(),
    AnalyticsScreen(),
    MaterialsScreen(),
    ProfileScreen(),
  ];

  static const _officerNavItems = <BottomNavigationBarItem>[
    BottomNavigationBarItem(
      icon: Icon(Icons.work_outline_rounded),
      activeIcon: Icon(Icons.work_rounded),
      label: 'Drives',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.bar_chart_outlined),
      activeIcon: Icon(Icons.bar_chart_rounded),
      label: 'Analytics',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.library_books_outlined),
      activeIcon: Icon(Icons.library_books_rounded),
      label: 'Materials',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.person_outline_rounded),
      activeIcon: Icon(Icons.person_rounded),
      label: 'Profile',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final isOfficer = auth.isOfficer;

    final pages = isOfficer ? _officerPages : _studentPages;
    final navItems = isOfficer ? _officerNavItems : _studentNavItems;
    final safeIndex = _selectedIndex.clamp(0, pages.length - 1);

    return Provider<GlobalKey<ScaffoldState>>.value(
      value: _scaffoldKey,
      child: Scaffold(
        key: _scaffoldKey,
        drawer: const AppDrawer(),
        body: IndexedStack(
          index: safeIndex,
          children: pages,
        ),
        bottomNavigationBar: Container(
          decoration: const BoxDecoration(
            border:
                Border(top: BorderSide(color: AppTheme.bgBorder, width: 1)),
          ),
          child: BottomNavigationBar(
            currentIndex: safeIndex,
            onTap: (i) => setState(() => _selectedIndex = i),
            items: navItems,
          ),
        ),
      ),
    );
  }
}
