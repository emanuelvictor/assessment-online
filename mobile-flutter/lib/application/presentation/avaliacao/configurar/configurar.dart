import 'package:flutter/material.dart';
import 'package:untitled/application/controls/emoji-icon.dart';

class Configurar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color.fromRGBO(74, 33, 116, 1.0),
      body: Center(
        child: Container(
          width: 490,
          child: Row(
            children: [
              Flexible(
                child: Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.zero,
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(20.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Flexible(
                            child: Text('Como você avalia nosso atendimento?',
                                style: TextStyle(fontSize: 20))),
                        Flexible(
                          child: Padding(
                            padding: EdgeInsets.fromLTRB(0, 15, 0, 10),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                              ],
                            ),
                          ),
                        ),
                        Flexible(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              Text('1/2', style: TextStyle(fontSize: 20)),
//                              FlatButton(
//                                onPressed: () => {},
//                                child: Text('Próximo',
//                                    style: TextStyle(fontSize: 20)),
//                              ),
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

