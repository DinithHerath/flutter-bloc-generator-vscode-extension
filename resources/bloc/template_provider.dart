import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'template_bloc.dart';
import 'template_state.dart';

class TemplateProvider extends BlocProvider<TemplateBloc> {
  TemplateProvider({
    Key key,
  }) : super(
          key: key,
          create: (context) => TemplateBloc(context),
          child: TemplateView(),
        );
}

class TemplateView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // ignore: close_sinks
    final templateBloc = BlocProvider.of<TemplateBloc>(context);

    final scaffold = Scaffold(
      body: BlocBuilder<TemplateBloc, TemplateState>(
        buildWhen: (pre, current) => true,
        builder: (context, state) {
          return Center(
            child: Text("Hi...Welcome to BLoC"),
          );
        },
      ),
    );

    return MultiBlocListener(
      listeners: [
        BlocListener<TemplateBloc, TemplateState>(
          listenWhen: (pre, current) => pre.error != current.error,
          listener: (context, state) {
            if (state.error?.isNotEmpty ?? false) print("ERROR: ${state.error}");
          },
        ),
      ],
      child: scaffold,
    );
  }
}
