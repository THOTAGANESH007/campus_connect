import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../theme.dart';
import 'reset_password_screen.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailCtrl = TextEditingController();
  final _otpCtrl = TextEditingController();
  int _step = 0; // 0=email, 1=otp
  String? _email;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _otpCtrl.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    final email = _emailCtrl.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Enter a valid email'), behavior: SnackBarBehavior.floating));
      return;
    }
    final auth = context.read<AuthProvider>();
    final err = await auth.forgotPassword(email);
    if (err != null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text(err),
            backgroundColor: AppTheme.error,
            behavior: SnackBarBehavior.floating));
      }
    } else {
      setState(() {
        _email = email;
        _step = 1;
      });
    }
  }

  Future<void> _verifyOtp() async {
    final otp = _otpCtrl.text.trim();
    if (otp.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Enter 6-digit OTP'), behavior: SnackBarBehavior.floating));
      return;
    }
    final auth = context.read<AuthProvider>();
    final err = await auth.verifyOtp(_email!, otp);
    if (err != null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text(err),
            backgroundColor: AppTheme.error,
            behavior: SnackBarBehavior.floating));
      }
    } else {
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
              builder: (_) => ResetPasswordScreen(email: _email!, otp: otp)),
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
                  onPressed: () {
                    if (_step == 1) {
                      setState(() => _step = 0);
                    } else {
                      Navigator.pop(context);
                    }
                  },
                ),
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
                      Icon(
                        _step == 0 ? Icons.lock_reset : Icons.email_outlined,
                        color: AppTheme.primary,
                        size: 40,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        _step == 0 ? 'Forgot Password?' : 'Verify OTP',
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        _step == 0
                            ? 'Enter your email to receive a 6-digit reset code.'
                            : 'Enter the OTP sent to $_email',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const SizedBox(height: 24),
                      if (_step == 0)
                        TextFormField(
                          controller: _emailCtrl,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(
                            labelText: 'Email Address',
                            prefixIcon: Icon(Icons.email_outlined),
                          ),
                        )
                      else
                        TextFormField(
                          controller: _otpCtrl,
                          keyboardType: TextInputType.number,
                          maxLength: 6,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                              fontSize: 24,
                              letterSpacing: 12,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.primary),
                          decoration: const InputDecoration(
                            labelText: 'OTP',
                            counterText: '',
                          ),
                        ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: auth.loading
                            ? null
                            : (_step == 0 ? _sendOtp : _verifyOtp),
                        child: auth.loading
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                    strokeWidth: 2, color: Colors.white))
                            : Text(_step == 0 ? 'Send OTP' : 'Verify OTP'),
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
