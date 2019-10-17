import 'package:flutter/material.dart';
import 'package:untitled/application/controls/quesito-icon.dart';
import 'package:untitled/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao-geral/conclusao.dart';

class FeedbackGeral extends StatelessWidget {
  @override
  Widget build(final BuildContext context) {

    next() {
      return () {
        Navigator.push(context, MaterialPageRoute(builder: (_) {
          return Conclusao();
        }));
      };
    }

    return Scaffold(
      backgroundColor: Color.fromRGBO(74, 33, 116, 1.0),
      body: Center(
        child: Container(
          width: 550,
          height: 550,
          child: Row(
            children: [
              Flexible(
                child: Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.zero,
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(15.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Flexible(
                          flex: 3,
                          child: TextFormField(
                            decoration: InputDecoration(
                                labelText: 'Feedback'
                            ),
                          )
                        ),
                        Flexible(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: <Widget>[
                              FlatButton(
                                onPressed: next(),
                                child: Text('Concluir', style: TextStyle(fontSize: 20)),
                              ),
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
