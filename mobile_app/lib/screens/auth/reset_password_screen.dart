import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../theme.dart';
import 'login_screen.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String email;
  final String otp;
  const ResetPasswordScreen({super.key, required this.email, required this.otp});

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _passCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _obscure1 = true, _obscure2 = true;

  @override
  void dispose() {
    _passCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  Future<void> _reset() async {
    if (_passCtrl.text.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Min 6 characters'), behavior: SnackBarBehavior.floating));
      return;
    }
    if (_passCtrl.text != _confirmCtrl.text) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Passwords do not match'), behavior: SnackBarBehavior.floating));
      return;
    }
    final auth = context.read<AuthProvider>();
    final err =
        await auth.resetPassword(widget.email, widget.otp, _passCtrl.text);
    if (err != null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text(err),
            backgroundColor: AppTheme.error,
            behavior: SnackBarBehavior.floating));
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text('Password reset successfully!'),
            backgroundColor: AppTheme.success,
            behavior: SnackBarBehavior.floating));
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => const LoginScreen()),
          (route) => false,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF0F172A), Color(0xFF1E1B4B), Color(0xFF0F172A)],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),
                IconButton(
                    icon: const Icon(Icons.arrow_back_ios_rounded),
                    onPressed: () => Navigator.pop(context)),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppTheme.bgCard,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.bgBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.key_rounded,
                          color: AppTheme.primary, size: 40),
                      const SizedBox(height: 12),
                      Text('Reset Password',
                          style: Theme.of(context).textTheme.headlineSmall),
                      const SizedBox(height: 6),
                      Text('Enter your new password',
                          style: Theme.of(context).textTheme.bodyMedium),
                      const SizedBox(height: 24),
                      TextFormField(
                        controller: _passCtrl,
                        obscureText: _obscure1,
                        decoration: InputDecoration(
                          labelText: 'New Password',
                          prefixIcon: const Icon(Icons.lock_outline),
                          suffixIcon: IconButton(
                            icon: Icon(_obscure1
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined),
                            onPressed: () =>
                                setState(() => _obscure1 = !_obscure1),
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),
                      TextFormField(
                        controller: _confirmCtrl,
                        obscureText: _obscure2,
                        decoration: InputDecoration(
                          labelText: 'Confirm Password',
                          prefixIcon: const Icon(Icons.lock_outline),
                          suffixIcon: IconButton(
                            icon: Icon(_obscure2
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined),
                            onPressed: () =>
                                setState(() => _obscure2 = !_obscure2),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: auth.loading ? null : _reset,
                        child: auth.loading
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                    strokeWidth: 2, color: Colors.white))
                            : const Text('Set New Password'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
