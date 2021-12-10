import 'package:flutter/material.dart';

@immutable
abstract class TemplateEvent {}

class ErrorEvent extends TemplateEvent {
  final String error;

  ErrorEvent(this.error);
}
