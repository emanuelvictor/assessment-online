import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class EmojiIcon extends StatelessWidget {
  EmojiEnum emojiEnum;
  var onPressed;
  @override
  Widget build(final BuildContext context) {
    String pathToIcon;
    String labelName;

    Widget svgIcon;

    if (emojiEnum == EmojiEnum.um) {
      pathToIcon = 'assets/emojis/um.svg';
      labelName = 'Péssimo'; // TODO VEM DA REQUISIÇÃO
      svgIcon = new SvgPicture.asset(pathToIcon,
          color: Color.fromRGBO(194, 28, 31, 1.0),
          semanticsLabel: 'um',
          width: 60,
          height: 60);
    } else if (emojiEnum == EmojiEnum.dois) {
      pathToIcon = 'assets/emojis/dois.svg';
      labelName = 'Ruim'; // TODO VEM DA REQUISIÇÃO
      svgIcon = new SvgPicture.asset(pathToIcon,
          color: Color.fromRGBO(233, 109, 1, 1.0),
          semanticsLabel: 'dois',
          width: 60,
          height: 60);
    } else if (emojiEnum == EmojiEnum.tres) {
      pathToIcon = 'assets/emojis/tres.svg';
      labelName = 'Regular'; // TODO VEM DA REQUISIÇÃO
      svgIcon = new SvgPicture.asset(pathToIcon,
          color: Color.fromRGBO(212, 196, 13, 1.0),
          semanticsLabel: 'tres',
          width: 60,
          height: 60);
    } else if (emojiEnum == EmojiEnum.quatro) {
      pathToIcon = 'assets/emojis/quatro.svg';
      labelName = 'Bom'; // TODO VEM DA REQUISIÇÃO
      svgIcon = new SvgPicture.asset(pathToIcon,
          color: Color.fromRGBO(143, 200, 44, 1.0),
          semanticsLabel: 'quatro',
          width: 60,
          height: 60);
    } else {
      pathToIcon = 'assets/emojis/cinco.svg';
      labelName = 'Ótimo'; // TODO VEM DA REQUISIÇÃO
      svgIcon = new SvgPicture.asset(pathToIcon,
          color: Color.fromRGBO(94, 233, 36, 1.0),
          semanticsLabel: 'cinco',
          width: 60,
          height: 60);
    }

    final column = new Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        svgIcon,
        Text(
          labelName,
          style: /*TextStyle(fontSize: 14.0)*/ Theme.of(context)
              .textTheme
              .subhead,
        )
      ],
    );

    final flatButton = FlatButton(
      padding: EdgeInsets.fromLTRB(4, 8, 4, 4),
      onPressed: onPressed,
      child: column,
    );

    return flatButton;
  }

  EmojiIcon(this.emojiEnum, this.onPressed);
}

enum EmojiEnum { um, dois, tres, quatro, cinco }
