import 'package:flutter/material.dart';

@immutable
class TemplateState {
  final String error;

  TemplateState({
    @required this.error,
  });

  static TemplateState get initialState => TemplateState(
        error: '',
      );

  TemplateState clone({
    String error,
  }) {
    return TemplateState(
      error: error ?? this.error,
    );
  }
}
