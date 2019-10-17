import 'package:flutter/material.dart';
import 'package:untitled/application/controls/emoji-icon.dart';
import 'package:untitled/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-quesitos/selecionar-quesitos/selecionar-quesitos.dart';

class SelecionarNota extends StatelessWidget {

  @override
  Widget build(final BuildContext context) {

    next() {
      return () {
        Navigator.push(context, MaterialPageRoute(builder: (_) {
          return SelecionarQuesitos();
        }));
      };
    }

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
                                EmojiIcon(EmojiEnum.um, next()),
                                EmojiIcon(EmojiEnum.dois, next()),
                                EmojiIcon(EmojiEnum.tres, next()),
                                EmojiIcon(EmojiEnum.quatro, next()),
                                EmojiIcon(EmojiEnum.cinco, next()),
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
