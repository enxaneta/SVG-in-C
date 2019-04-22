let the_d, closed, lc_d_ry, uc_d_ry;

Init();

TA.addEventListener("input", () => {
  Init();
});

function Init() {
  // the value of the d is the value of the textarea
  the_d = TA.value;
  // set the d attribute of the path
  thePath.setAttributeNS(null, "d", the_d);
  // set the viewBox of the svg element
  setViewBox(thePath);
  // is the path closed?
  closed = null;
  //formatedArgsArray takes care of long commands
  lc_d_ry = formatedArgsArray(the_d);
  //SVG2UpperCase changes all commands to uppercase
  uc_d_ry = SVG2UpperCase(lc_d_ry);

  let UC_path = joinRy2d(uc_d_ry);
  UCPath.setAttributeNS(null, "d", UC_path);
  output.textContent = UC_path;
}

function setViewBox(thePath) {
  let BB = thePath.getBBox();
  let viewBx = `${BB.x - 10} ${BB.y - 10} ${BB.width + 20} ${BB.height + 20}`;
  theSVG.setAttributeNS(null, "viewBox", viewBx);

  reversedSVG.setAttributeNS(null, "viewBox", viewBx);
}

//--------------Get the array of the svg commands---------
function formatedArgsArray(d) {
  //takes care of long commands
  /*The command letter can be eliminated on subsequent commands if the same command is used multiple times in a row (e.g., you can drop the second "L" in "M 100 200 L 200 100 L -100 -200" and use "M 100 200 L 200 100 -100 -200" instead).*/
  let ArgsRy = getArgsRys(d);
  let newArgsArray = [];
  ArgsRy.map((a, index) => {
    let prefix = a[0];
    let UCprefix = prefix.toUpperCase();

    let n, tempRy;
    if (UCprefix == "H" || UCprefix == "V") {
      n = 1;
    }
    if (UCprefix == "L" || UCprefix == "T" || UCprefix == "M") {
      n = 2;
    }
    if (UCprefix == "S" || UCprefix == "Q") {
      n = 4;
    }
    if (UCprefix == "C") {
      n = 6;
    }
    if (UCprefix == "A") {
      n = 7;
    }
    if (a.length > n + 1) {
      //if the length of the array a is longer than it should be
      tempRy = a.splice(1);
      //long_Absolute_command returns an array of arrays
      let newTempsArray = long_Absolute_command(tempRy, n, prefix);
      ArgsRy[index] = newTempsArray;
    }
  });

  ArgsRy.map(a => {
    if (Array.isArray(a[0])) {
      //if it's an array of arrays
      a.map(_a => {
        newArgsArray.push(_a);
      });
    } else {
      newArgsArray.push(a);
    }
  });

  return newArgsArray;
}

function long_Absolute_command(tempRy, n, prefix) {
  /* This function is splitting a long command like this:  ["L", 160", "160.622", "90", "160.622", "55", "100", "90", "39.378", "160", "39.378", "195", "100"] in several L commands: */
  //tempRy = ["160", "160.622", "90", "160.622", "55", "100", "90", "39.378", "160", "39.378", "195", "100"]
  //prefix = "L"
  //n = 2 (After the L comes 2 coords: x and y)

  let CommandsRy = [];

  while (tempRy.length > 0) {
    CommandsRy.push(tempRy.splice(0, n));
  }

  CommandsRy.forEach(c => {
    c = c.unshift(prefix);
  });

  // CommandsRy = [["L", "160", "160.622"],["L", "90", "160.622"],["L", "55", "100"],["L", "90", "39.378"],["L", "160", "39.378"],["L", "195", "100"]]

  return CommandsRy;
}

function getArgs(d) {
  //remove breaklines and tabs and spaces
  let _d = d.replace(/\r?\n|\r|\t|  +/g, "");

  if (_d.charAt(0) == "m") {
    _d = "M" + _d.slice(1);
  }
  let argsRX = /(?=[a-zA-Z])/;
  let args = _d.split(argsRX);

  return args;
}

function getArgsRys(d) {
  let args = getArgs(d);

  let ArgsRy = [];

  for (let i = 0; i < args.length; i++) {
    let values = args[i]
      .slice(1)
      .replace(/\-/g, " -")
      .split(/[ ,]+/);

    values.map((p, i) => {
      if (p == "") {
        values.splice(i, 1);
      }
    });

    let ry = [args[i].charAt(0)].concat(values);
    ArgsRy.push(ry);
  }
  return ArgsRy;
}
//--------------END Get the array of the svg commands-----

function SVG2UpperCase(commands) {
  for (let i = 1; i < commands.length; i++) {
    let c = commands[i];
    let prev = commands[i - 1];

    let x_ = Number(prev[prev.length - 2]);
    let y_ = Number(prev[prev.length - 1]);

    if (c[0].toUpperCase() !== c[0]) {
      //if is lower case

      switch (c[0]) {
        case "v":
          console.log("v",c[1],y_)
          c[0] = "L";
          c[2] = Number(c[1]) + y_; //y
          c[1] = x_; //x
          
          break;
        case "h":
          console.log("h",c[1])
          c[0] = "L";
          c[1] = Number(c[1]) + x_; //x
          c[2] = y_; //y
          break;
        case "q":
        case "s":
          c[1] = Number(c[1]) + x_; //x
          c[2] = Number(c[2]) + y_; //y
          c[3] = Number(c[3]) + x_; //x
          c[4] = Number(c[4]) + y_; //y
          break;
        case "c":
          c[1] = Number(c[1]) + x_; //x
          c[2] = Number(c[2]) + y_; //y
          c[3] = Number(c[3]) + x_; //x
          c[4] = Number(c[4]) + y_; //y
          c[5] = Number(c[5]) + x_; //x
          c[6] = Number(c[6]) + y_; //y
          break;
        case "z":
          c[0] = "Z";
          break;
        default:
          // l, t, m, a
          c[c.length - 2] = Number(c[c.length - 2]) + x_; //x
          c[c.length - 1] = Number(c[c.length - 1]) + y_; //y
      }
    } // END if is lower case

    c[0] = c[0].toUpperCase();
  }

  return commands;
}

function joinRy2d(argsRy) {
  //Joins the `argsRy` to a `d` attribute.
  let d = "";

  for (let i = 0; i < argsRy.length; i++) {
    let arg = argsRy[i];
    let _str = arg[0]; //the commend
    for (let j = 1; j < arg.length; j++) {
      _str += Number(arg[j]);
      if (j % 2 == 0) {
        _str += " ";
      } else {
        _str += ", ";
      }
    }

    d += _str;
  }

  return d;
}
