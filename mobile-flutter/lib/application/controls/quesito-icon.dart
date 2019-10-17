import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class QuesitoIcon extends StatefulWidget {
  @override
  StateQuesitoIcon createState() => StateQuesitoIcon();
}

class StateQuesitoIcon extends State<QuesitoIcon> {

  var selected = false;

  @override
  Widget build(final BuildContext context) {
    final String pathToIcon = 'assets/images/person.svg';
    final String labelName = 'Quesi asdfasdfa asdfasdf sdfato';
    final Widget svgIcon = new SvgPicture.asset(
      pathToIcon,
      color: Colors.white,
      semanticsLabel: 'quesito',
    );

    final Widget bigCircle = new Container(
      padding: EdgeInsets.all(10.0),
      width: 78.0,
      height: 78.0,
      decoration: new BoxDecoration(
        color: Color.fromRGBO(223, 229, 231, 1.0),
        shape: BoxShape.circle,
      ),
      child: svgIcon,
    );

    final column = new Column(
      children: <Widget>[
        bigCircle,
        Text(
          labelName,
          textAlign: TextAlign.center,
//          softWrap: false,
//          overflow: TextOverflow.ellipsis,
          style: Theme.of(context).textTheme.subhead,
        )
      ],
    );

    final flatButton = FlatButton(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.zero,
      ),
      padding: EdgeInsets.fromLTRB(4, 8, 4, 4),
      color: !selected ? Colors.white : Colors.lightBlue,
      onPressed: () => setState(() {
            selected = !selected;
          }),
      child: column,
    );

    return Container(child: flatButton);
  }
}
