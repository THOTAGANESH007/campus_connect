import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../theme.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final List<Map<String, dynamic>> _history = [];
  final _msgCtrl = TextEditingController();
  final _scrollCtrl = ScrollController();
  bool _loading = false;

  @override
  void dispose() {
    _msgCtrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage() async {
    final text = _msgCtrl.text.trim();
    if (text.isEmpty || _loading) return;
    _msgCtrl.clear();

    // Add user message to history
    setState(() {
      _history.add({
        'role': 'user',
        'parts': [{'text': text}],
      });
      _loading = true;
    });
    _scrollToBottom();

    try {
      final res = await ApiService.instance.sendChatMessage(_history);
      final reply = res.data['text'] ?? res.data['reply'] ?? '';
      setState(() {
        _history.add({
          'role': 'model',
          'parts': [{'text': reply}],
        });
      });
    } catch (e) {
      setState(() {
        _history.add({
          'role': 'model',
          'parts': [{'text': '⚠️ Failed to get response. Please try again.'}],
        });
      });
    }
    setState(() => _loading = false);
    _scrollToBottom();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.smart_toy_rounded, color: AppTheme.primaryLight, size: 22),
            SizedBox(width: 8),
            Text('AI Placement Assistant'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_sweep_outlined),
            tooltip: 'Clear chat',
            onPressed: () => setState(() => _history.clear()),
          ),
        ],
      ),
      body: Column(
        children: [
          // Messages
          Expanded(
            child: _history.isEmpty
                ? _WelcomeView()
                : ListView.builder(
                    controller: _scrollCtrl,
                    padding: const EdgeInsets.all(12),
                    itemCount: _history.length,
                    itemBuilder: (_, i) {
                      final msg = _history[i];
                      final isUser = msg['role'] == 'user';
                      final text =
                          (msg['parts'] as List?)?.first['text'] ?? '';
                      return _ChatBubble(
                          text: text, isUser: isUser);
                    },
                  ),
          ),

          // Typing indicator
          if (_loading)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Row(
                children: [
                  SizedBox(
                    width: 32,
                    height: 32,
                    child: CircularProgressIndicator(
                        strokeWidth: 2, color: AppTheme.primary),
                  ),
                  SizedBox(width: 10),
                  Text('AI is thinking...',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 13)),
                ],
              ),
            ),

          // Input box
          Container(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 20),
            decoration: const BoxDecoration(
              color: AppTheme.bgCard,
              border: Border(top: BorderSide(color: AppTheme.bgBorder)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _msgCtrl,
                    maxLines: null,
                    keyboardType: TextInputType.multiline,
                    textInputAction: TextInputAction.newline,
                    decoration: const InputDecoration(
                      hintText: 'Ask me anything about placements...',
                      contentPadding:
                          EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  style: IconButton.styleFrom(
                      backgroundColor: AppTheme.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.all(12)),
                  icon: const Icon(Icons.send_rounded),
                  onPressed: _loading ? null : _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _WelcomeView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final suggestions = [
      'How do I prepare for technical interviews?',
      'What are common aptitude question types?',
      'Tips for resume writing?',
      'How to crack a FAANG interview?',
    ];
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                  colors: [AppTheme.primary, AppTheme.secondary]),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Icon(Icons.smart_toy_rounded,
                size: 44, color: Colors.white),
          ),
          const SizedBox(height: 16),
          Text('AI Placement Assistant',
              style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          Text(
            'Ask me anything about interview prep, resume tips, or placement drives.',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 24),
          ...suggestions.map((s) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: GestureDetector(
                  onTap: () {
                    final state = context
                        .findAncestorStateOfType<_ChatScreenState>();
                    state?._msgCtrl.text = s;
                  },
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 12),
                    decoration: BoxDecoration(
                      color: AppTheme.bgCard,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppTheme.bgBorder),
                    ),
                    child: Row(children: [
                      const Icon(Icons.lightbulb_outline,
                          size: 16, color: AppTheme.warning),
                      const SizedBox(width: 8),
                      Expanded(
                          child: Text(s,
                              style: Theme.of(context).textTheme.bodyMedium)),
                    ]),
                  ),
                ),
              )),
        ],
      ),
    );
  }
}

class _ChatBubble extends StatelessWidget {
  final String text;
  final bool isUser;
  const _ChatBubble({required this.text, required this.isUser});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints: BoxConstraints(
            maxWidth: MediaQuery.of(context).size.width * 0.82),
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          gradient: isUser
              ? const LinearGradient(
                  colors: [AppTheme.primaryDark, AppTheme.primary])
              : null,
          color: isUser ? null : AppTheme.bgCard,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft:
                isUser ? const Radius.circular(16) : const Radius.circular(4),
            bottomRight:
                isUser ? const Radius.circular(4) : const Radius.circular(16),
          ),
          border: isUser
              ? null
              : Border.all(color: AppTheme.bgBorder),
        ),
        child: isUser
            ? Text(text,
                style: const TextStyle(color: Colors.white, fontSize: 14))
            : MarkdownBody(
                data: text,
                styleSheet: MarkdownStyleSheet(
                  p: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
                  code: const TextStyle(
                      backgroundColor: AppTheme.bgSurface,
                      color: AppTheme.accent,
                      fontSize: 13),
                  codeblockDecoration: BoxDecoration(
                      color: AppTheme.bgSurface,
                      borderRadius: BorderRadius.circular(8)),
                ),
              ),
      ),
    );
  }
}
