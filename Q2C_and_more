function getArgs(path){
/*get the d attribute of an SVG path: 
d ="M50,60 l140,-25 v125 h-160 z"*/
//remove breaklines and tabs and spaces
let d = path.getAttribute("d").replace(/\r?\n|\r|\t|  +/g, "");
// if the first command is a lower case m transforms it to uppercase  
if(d.charAt(0) == "m"){d = "M"+d.slice(1);}
let argsRX = /(?=[a-zA-Z])/;
let args = d.split(argsRX);
transform the d attribute into an array 
return args;
//["M50,60 ", "l140,-25 ", "v125 ", "h-160 ", "z"]
} 
function getArgsRys(path){
  let args = getArgs(path);
  //args = ["M50,60 ", "l140,-25 ", "v125 ", "h-160 ", "z"]
  let ArgsRy = [];
  
  for(let i = 0; i < args.length; i++){

      let values = (args[i].slice(1).replace( /\-/g, " -").split(/[ ,]+/));
   
      values.map((p,i)=>{if(p == ""){values.splice(i,1)}});
      
      let ry = [args[i].charAt(0)].concat(values);
      ArgsRy.push(ry)
  
}
  return ArgsRy;
  /*the returned value looks like this:
  [["M", "50", "60"],["l", "140", "-25"],["v", "125"],["h", "-160"],["z"]]*/
};

function V2L_helper(previous,command){
  // changes a V/v command to L
  // the previous argument may look like this: ["L", "140", "-25"]
  // the command argument may look like this: ["v", "125"]
  // the specific letter of the the previous command IS in uppercase!!
  let temp = command.slice(0);
  if(command[0] == "v"){
   temp[0] ="L";
   temp[1] = previous[previous.length-2];//x
   temp[2] = Number(command[1]) + Number(previous[previous.length-1]);//y
  }else if(command[0] == "V"){
   temp.splice(1, 0,previous[previous.length-2]);
   temp[0] ="L";
  }
 return temp;
}
function H2L_helper(previous,command){
  // changes a H/h command to L
  // the previous argument may look like this: ["L", "140", "-25"]
  // the command argument may look like this: ["h", "125"]
  // the specific letter of the the previous command IS in uppercase!!
  let temp = command.slice(0);
  if(command[0] == "h"){
     temp[0] ="L";
     temp[1] = Number(command[1]) + Number(previous[previous.length-2]);//x
     temp[2] = previous[previous.length-1];//y
  }else if(command[0] == "H"){
    temp[0] ="L";
    temp.push(previous[previous.length-1]);//y
  }
  return temp;
}
function LC2UC_helper(previous,command){
 // changes the actual command from lower case to upper case
       command[0] = command[0].toUpperCase();
       
       for(let j = 1; j < command.length; j++){
         if(j%2 == 0){//y
           command[j] = Number(command[j]) + Number(previous[previous.length-1]);
         }else{//x
           command[j] = Number(command[j]) + Number(previous[previous.length-2]);
         }
       }
 
  return command;
}
function long_L_command(command){
//a helper to deal with long L commands 
//the command argument may look like this: ["L", "160", "160.622", "90", "160.622", "55", "100", "90", "39.378", "160", "39.378", "195", "100"];
   let prefix = command[0];
   if(prefix == "L"){
    let tempRy = command.splice(1);

    let ryOFry = [];// an array of arrays

    while (tempRy.length > 0){
    let subRy = tempRy.splice(0,2);
    subRy.unshift(prefix);
    ryOFry.push(subRy);
    }
    return ryOFry;  
}
//The output of this function should look like this: [["L", "160", "160.622"],["L", "90", "160.622"],["L", "55", "100"],["L", "90", "39.378"],["L", "160", "39.378"],["L", "195", "100"]]
}

function Q2C_helper(previous,command){
// a function to change a Qadratic Bézier (Q) curve into a Cubic Bézier (C)
for(let i = 1; i< previous.length; i++){previous[i] = Number(previous[i])}
for(let i = 1; i< command.length; i++){command[i] = Number(command[i])}

let Q = [[previous[previous.length-2],previous[previous.length-1]],command];

let cp1 = {}
let cp2 = {}
cp1.x = Number(Q[0][0] + 2/3 * (Q[1][1] - Q[0][0]));
cp1.y = Number(Q[0][1] + 2/3 * (Q[1][2] - Q[0][1]));
cp2.x = Number(Q[1][3] + 2/3 * (Q[1][1] - Q[1][3]));
cp2.y = Number(Q[1][4] + 2/3 * (Q[1][2] - Q[1][4]));

  
return (["C",cp1.x,cp1.y,cp2.x,cp2.y,Number(command[3]),Number(command[4])])   
}
function L2C_helper(previous,command){
//a function to change a line (L) to Cubic Bézier (C)
let x0 = Number(previous[previous.length-2]);
let y0 = Number(previous[previous.length-1]);
let x3 = Number(command[1]);
let y3 = Number(command[2]);
let x1 = Number(x0 + (x3 - x0)/3);
let y1 = Number(y0 + (y3 - y0)/3);
let x2 = Number(x0 + 2*(x3 - x0)/3);
let y2 = Number(y0 + 2*(y3 - y0)/3);
       
return["C",x1,y1,x2,y2,x3,y3];
}
function S2C_helper(previous,command){
//a function to change a Smooth Cubic Bézier (S) to a Cubic Bézier (C)
let x2 = Number((previous[previous.length - 4]));
let y2 = Number((previous[previous.length - 3]));
let x3 = Number((previous[previous.length - 2]));
let y3 = Number((previous[previous.length - 1]));

    
// the reflected control point  
let reflected_x = (2*x3 - x2);
let reflected_y = (2*y3 - y2);
  
  
return ["C",reflected_x,reflected_y,command[1],command[2],command[3],command[4]]
}



// HOW TO USE

let ry = getArgsRys(path);

// first deal with V/v (V2L_helper), ahd H/h (H2L_helper) commands and change everything to uppercase (LC2UC_helper)

for(let i=1; i < ry.length; i++ ){
  let command = ry[i].slice(0);
  let previous = ry[i-1];
  if(command[0].toUpperCase() == "V"){
  ry[i] = V2L_helper(previous,command);
  }else if(command[0].toUpperCase() == "H"){
  ry[i] = H2L_helper(previous,command);
  }else  if(command[0] === command[0].toLowerCase() && command[0] != "z"){ 
    //if it's lower case and not "z"
  ry[i] = LC2UC_helper(previous,command);  
  }
}

// then deal with long L commands (long_L_command)
for(let i=1; i < ry.length; i++ ){
  let command = ry[i].slice(0);
  let previous = ry[i-1]; 
  if(command[0] == "L"){
    ry.splice(i,1,...long_L_command(command))
  } 
}

// Change L, Q & S to Cubic Bézier (C)
for(let i=1; i < ry.length; i++ ){
  let command = ry[i].slice(0);
  let previous = ry[i-1];
  if(command[0] == "L"){ry[i] = L2C_helper(previous,command);}
  if(command[0] == "Q"){ry[i] = Q2C_helper(previous,command);}
  if(command[0] == "S"){ry[i] = S2C_helper(previous,command);}
}



//console.log(ry);


// Put it all back together
function joinRy2d(argsRy){
  /*the argsRy argument should look like this:
  [["M", "9", "15"],["C", "9", "20", "0", "21", "0", "16"],["C", "0", "11", "6", "9", "10", "0"],["C", "14", "9", "20", "11", "20", "16"],["C", "20", "21", "11", "20", "11", "15"],["C", 11, 18, 12, 20, 13, 20],["C", "11", "20", "9", "20", "7", "20"],["C", "8", "20", "9", "18", "9", "15"],["Z"]]
  */
  let d="";
  
  for(let i = 0; i < argsRy.length; i++){
   
    let arg = argsRy[i];
    let _str = arg[0]; //the commend
    for (let j = 1; j< arg.length; j++){
      _str += Number(arg[j]).toFixed(3);
      if(j%2 == 0){_str += " ";}else{_str += ", "}
    }
    
    d += _str;
  }
  console.log(d);
  return d;  
}

testSVG.setAttributeNS(null,"d",joinRy2d(ry))
