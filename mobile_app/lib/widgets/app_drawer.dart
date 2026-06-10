import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme.dart';
import '../screens/chat/chat_screen.dart';
import '../screens/chat/resume_analyzer_screen.dart';
import '../screens/forum/forum_screen.dart';
import '../screens/drives/interview_qa_screen.dart';
import '../screens/analytics/analytics_screen.dart';
import '../screens/profile/saved_items_screen.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;
    final isOfficer = auth.isOfficer;

    return Drawer(
      child: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF1E1B4B), AppTheme.bgCard],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // ── User Header ───────────────────────────────────
              Container(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: AppTheme.primary.withValues(alpha: 0.2),
                      backgroundImage: user?.profilePic != null
                          ? NetworkImage(user!.profilePic!)
                          : null,
                      child: user?.profilePic == null
                          ? Text(
                              (user?.name ?? 'U')[0].toUpperCase(),
                              style: const TextStyle(
                                  color: AppTheme.primaryLight,
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold),
                            )
                          : null,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user?.name ?? '',
                            style: const TextStyle(
                                color: AppTheme.textPrimary,
                                fontWeight: FontWeight.w600,
                                fontSize: 16),
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: isOfficer
                                  ? AppTheme.accent.withValues(alpha: 0.2)
                                  : AppTheme.primary.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              user?.role.replaceAll('_', ' ') ?? '',
                              style: TextStyle(
                                  color: isOfficer
                                      ? AppTheme.accent
                                      : AppTheme.primaryLight,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const Divider(color: AppTheme.bgBorder),

              // ── Shared: Forum & Interview Q&A ─────────────────
              _DrawerTile(
                icon: Icons.forum_outlined,
                label: 'Community Forum',
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(context,
                      MaterialPageRoute(builder: (_) => const ForumScreen()));
                },
              ),
              _DrawerTile(
                icon: Icons.question_answer_outlined,
                label: 'Interview Q&A',
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const InterviewQAScreen()));
                },
              ),

              // ── STUDENT-ONLY ──────────────────────────────────
              if (!isOfficer) ...[
                const _SectionLabel('Student Tools'),
                _DrawerTile(
                  icon: Icons.smart_toy_outlined,
                  label: 'AI Chat Assistant',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const ChatScreen()));
                  },
                ),
                _DrawerTile(
                  icon: Icons.document_scanner_outlined,
                  label: 'ATS Resume Analyzer',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const ResumeAnalyzerScreen()));
                  },
                ),
                _DrawerTile(
                  icon: Icons.bookmark_rounded,
                  label: 'Saved Drives',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const SavedItemsScreen()));
                  },
                ),
              ],

              // ── OFFICER / ADMIN ONLY ──────────────────────────
              if (isOfficer) ...[
                const _SectionLabel('Management'),
                _DrawerTile(
                  icon: Icons.bar_chart_rounded,
                  label: 'Placement Analytics',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const AnalyticsScreen()));
                  },
                ),
                _DrawerTile(
                  icon: Icons.smart_toy_outlined,
                  label: 'AI Chat Assistant',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const ChatScreen()));
                  },
                ),
              ],

              const Spacer(),
              const Divider(color: AppTheme.bgBorder),
              _DrawerTile(
                icon: Icons.logout_rounded,
                label: 'Sign Out',
                iconColor: AppTheme.error,
                labelColor: AppTheme.error,
                onTap: () async {
                  Navigator.pop(context);
                  await context.read<AuthProvider>().signOut();
                },
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Section Label ──────────────────────────────────────────────────────────
class _SectionLabel extends StatelessWidget {
  final String text;
  const _SectionLabel(this.text);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
      child: Text(
        text.toUpperCase(),
        style: const TextStyle(
          color: AppTheme.textMuted,
          fontSize: 10,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}

// ── Drawer Tile ────────────────────────────────────────────────────────────
class _DrawerTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color iconColor;
  final Color labelColor;

  const _DrawerTile({
    required this.icon,
    required this.label,
    required this.onTap,
    this.iconColor = AppTheme.textSecondary,
    this.labelColor = AppTheme.textPrimary,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: iconColor),
      title: Text(label,
          style: TextStyle(color: labelColor, fontWeight: FontWeight.w500)),
      onTap: onTap,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      horizontalTitleGap: 0,
    );
  }
}
