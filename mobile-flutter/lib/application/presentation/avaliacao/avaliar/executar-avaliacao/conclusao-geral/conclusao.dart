import 'package:flutter/material.dart';
import 'package:untitled/application/controls/quesito-icon.dart';

class Conclusao extends StatelessWidget {
  @override
  Widget build(final BuildContext context) {
    return Scaffold(
      backgroundColor: Color.fromRGBO(74, 33, 116, 1.0),
      body: Center(
        child: Container(
          width: 550,
          height: 150,
          child: Row(
            children: [
              Flexible(
                child: Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.zero,
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(25.0),
                    child: Center(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          Column(
//                            mainAxisSize: MainAxisSize.min,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Agradecemos a participação', style: TextStyle(fontSize: 20, fontFamily: 'Roboto')),
                              Text('Obrigado!'),
                              Text('Volte sempre!!!'),
                            ],
                          )
                        ],
                      ),
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
