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



