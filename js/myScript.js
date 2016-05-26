

var main = function(){

    var grid, count, n, inPlay, com, pla;



    $("#btn-player").click(function(){
        inPlay = true;
        com = 'O';
        pla = 'X';
        init();
        $(".btn").hide();
        rotate();
        //turnMsg();
    })

    $("#btn-com").click(function(){
        inPlay = true;
        com = 'X';
        pla = 'O';
        init();
        $(".btn").hide();
        rotate();
        //place(initial());
    })

    $("td").click(function(){
        var id = this.id;  
        if (inPlay && grid[Math.floor(id/n)][id%n] == ''){
            var cur = $(this);
            fill(cur);
            gearMsg();
            grid[Math.floor(id/n)][id%n] = pla;
            count++;

            if (count==n*n) {
                drawMsg();
                endGame();
            } 

            var pos = -1;
            if (count >2 ) pos = traverse(id);
            else pos = initial();

            //gearMsg();
            place(pos);
            turnMsg();

            if (count==n*n) {
                drawMsg();
                endGame();
            } 
        }
    })

    function mouseOver() {
        $(this).css("color", "rgba(0,0,0,0.3");
        $(this).text(pla);
    }
    function mouseOut(){
        $(this).css("color", "black");
        $(this).text("");
    }

    var fill = function(cur){
        cur.unbind('mouseover', mouseOver).unbind('mouseout', mouseOut);
        cur.text(pla);
        cur.css("color", "black");
    }

    var init = function(){
        grid = [];
        count = 0;
        n = 3 ;
        inPlay = true;

        for(var i=0;i<n;i++){
            grid[i] = [];
            for(var j=0;j<n;j++){
                grid[i][j] = '';
            }
        }
        $("td").text("");
        $("td").bind('mouseover', mouseOver).bind('mouseout', mouseOut);
        $("td").css("color", "black");
        //$("#stats").text("");
    }

    var initial = function(){
        if (grid[1][1] == '') return n+1;
        if (grid[0][0] == '') return 0;
        if (grid[0][n-1] == '') return n-1;
        if (grid[n-1][0] == '') return (n-1)*n;
        return (n-1)*n+(n-1);
    }

    var points = function(countC, countP){

        if (countC == 2 && countP == 0) return 6; //win
        if (countC == 0 && countP == 2) return 5; //block
        if (countC == 1 && countP == 0) return 2; //fork
        //if (countC == 0 && countP == 1) return 1; //block fork
        return 0; 
    }

    var traverse = function(id){
        var max = -1, index = -1, points = 0;
        for(var i=0;i<n;i++){
            for(var j=0;j<n;j++){
                if (grid[i][j] !== '') { continue; }
                points = calc(i,j); 
                if (points > max) {
                    max = points;
                    index = i*n+j;
                }
            }
        }
        return index;
    }

    var hor = function(i,j){
        var countC = 0; countP = 0, p = 0;
        for(var k=0;k<n;k++) {
            if (grid[i][k]==com) countC++;
            else if (grid[i][k]==pla) countP++;
        }
        p = points(countC, countP);
        if (p==6){
            for(var k=0;k<n;k++){
                mark(i*n+k);
            }
            winMsg();
            endGame();
        }
        return p;
    }

    var ver = function(i, j){
        var countC = 0; countP = 0, p = 0;
        for(var k=0;k<n;k++) {
            if (grid[k][j]==com) countC++;
            else if (grid[k][j]==pla) countP++;
        }
        p = points(countC, countP); 
        if (p == 6) {
            for(var k=0;k<n;k++){
                mark(k*n+j);
            }
            winMsg();
            endGame();
        }
        return p;
    }

    var diag = function(i, j){
        if (i!=j) return 0;
        var countC = 0; countP = 0, p = 0;
        for(var k=0;k<n;k++) {
            if (grid[k][k]==com) countC++;
            else if (grid[k][k]==pla) countP++;
        }
        p = points(countC, countP);
        if (p== 6){
            for(var k=0;k<n;k++){
                mark(k*n+k);
            }
            winMsg();
            endGame();
        }
        return p;
    }

    var rdiag = function(i, j){
        if (i+j!=n-1) return 0;
        var countC = 0; countP = 0, p = 0; 
        for(var k=0;k<n;k++) {
            if (grid[k][n-1-k]==com) countC++;
            else if (grid[k][n-1-k]==pla) countP++;
        }
        p = points(countC, countP);
        if (p== 6){
            for(var k=0;k<n;k++){
                mark(k*n+(n-1-k));
            }
            winMsg();
            endGame();
        }
        return p;
    }


    var mark = function(id){
        $("#" + id).css("color", "red");
    }

    var endGame = function(){
        inPlay = false;
        $(".btn").show();
    }

    var winMsg = function (){
        $("#stats").html("Better luck next time.");
    }

    var drawMsg = function (){
        $("#stats").html("Nobody wins.");
    }

    var turnMsg = function(){
        $("#stats").html("Your turn, human.");
    }

    var rotate = function(){
        var angle = 0;
        var intervalID = setInterval(function() {
            angle +=15;
            if (angle==300) clearInterval(intervalID);
            $("#gear").css("-webkit-transform", "rotate("+angle+"deg");
            $("#gear").css("-moz-transform", "rotate("+angle+"deg");
            $("#gear").css("-o-transform", "rotate("+angle+"deg");
            $("#gear").css("transform", "rotate("+angle+"deg");
        }, 50);
    }

    var calc = function(i,j){
        var points = 0, countP = 0, countC = 0;

        points += hor(i, j);
        points += ver(i, j);
        points += diag(i, j);
        points += rdiag(i, j);

        return points;
    }
    
    var place = function(pos){
        var cur = $("#" + pos);
        grid[Math.floor(pos/n)][pos%n] = com;
        cur.text(com);
        cur.unbind('mouseover', mouseOver).unbind('mouseout', mouseOut);
        count++;
    }

}

$(document).ready(main);
