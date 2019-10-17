import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-quesitos/selecionar-nota/selecionar-nota.dart';



void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
//    SystemChrome.setEnabledSystemUIOverlays ([SystemUiOverlay.top, SystemUiOverlay.bottom]);
    SystemChrome.setEnabledSystemUIOverlays ([]);
    return Container(
      child: MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.deepPurple,
        ),
        home: SelecionarNota(),
      ),
    );
  }
}

//class MyHomePage extends StatefulWidget {
//  MyHomePage({Key key, this.title}) : super(key: key);
//
//  // This widget is the home page of your application. It is stateful, meaning
//  // that it has a State object (defined below) that contains fields that affect
//  // how it looks.
//
//  // This class is the configuration for the state. It holds the values (in this
//  // case the title) provided by the parent (in this case the App widget) and
//  // used by the build method of the State. Fields in a Widget subclass are
//  // always marked "final".
//
//  final String title;
//
//  @override
//  SelecionarNota createState() => SelecionarNota();
//}

//class _MyHomePageState extends State<MyHomePage> {
//  @override
//  Widget build(BuildContext context) {
//    return Scaffold(
//      backgroundColor: Color.fromRGBO(74, 33, 116, 1.0),
//      body: Center(
//        child: Container(
//          width: 490,
//          child: Row(
//            children: [
//              Flexible(
//                child: Card(
//                  shape: RoundedRectangleBorder(
//                    borderRadius: BorderRadius.zero,
//                  ),
//                  child: Padding(
//                    padding: EdgeInsets.all(20.0),
//                    child: Column(
//                      mainAxisSize: MainAxisSize.min,
//                      children: [
//                        Flexible(
//                            child: Text('Como você avalia nosso atendimento?',
//                                style: TextStyle(fontSize: 20))),
//                        Flexible(
//                          child: Padding(
//                            padding: EdgeInsets.fromLTRB(0, 15, 0, 10),
//                            child: Row(
//                              mainAxisAlignment: MainAxisAlignment.center,
//                              children: <Widget>[
//                                EmojiIcon(EmojiEnum.um),
//                                EmojiIcon(EmojiEnum.dois),
//                                EmojiIcon(EmojiEnum.tres),
//                                EmojiIcon(EmojiEnum.quatro),
//                                EmojiIcon(EmojiEnum.cinco),
//                              ],
//                            ),
//                          ),
//                        ),
//                        Flexible(
//                          child: Row(
//                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                            children: <Widget>[
//                              Text('1/2'),
//                              FlatButton(
//                                onPressed: () => {},
//                                child: Text('Próximo',
//                                    style: TextStyle(fontSize: 20)),
//                              ),
//                            ],
//                          ),
//                        )
//                      ],
//                    ),
//                  ),
//                ),
//              ),
//            ],
//          ),
//        ),
//      ),
//    );
//  }
//}
