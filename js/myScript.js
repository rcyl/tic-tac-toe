

var main = function(){

    var grid, count, n, inPlay, com, pla;

    $("#gear").hide();
    $("#text").hide();

    $("#btn-player").click(function(){
        com = 'O';
        pla = 'X';
        init();
        $("#text").show();
        $(".btn").hide();
    })

    $("#btn-com").click(function(){
        com = 'X';
        pla = 'O';
        init();
        $(".btn").hide();
        inPlay = false;
        place(initial());
    })

    $("td").click(function(){
        var id = this.id;  
        if (inPlay && grid[Math.floor(id/n)][id%n] == ''){
            var cur = $(this);
            fill(cur);
            $("#text").hide();
            grid[Math.floor(id/n)][id%n] = pla;
            count++;
            
            if (count==n*n) {
                draw();
                return;
            }
            var pos = -1;
            if (count >2 ) pos = traverse(id);
            else pos = initial();

            if (inPlay) place(pos);

            if (count==n*n){
                setTimeout(function()
                           { draw(); }, 1000)
                return;
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
        $("#text").hide();
        $("#text").html("Your turn, human.");
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

    var markHor = function(i, j){
        for(var k=0;k<n;k++) mark(i*n+k);
    }
    
    var markVer = function(i, j){
        for(var k=0;k<n;k++) mark(k*n+j);
    }

    var markDiag = function(i, j){
        for(var k=0;k<n;k++) mark(k*n+k);
    }

    var markRdiag = function(i, j){
        for(var k=0;k<n;k++) mark(k*n+(n-1-k));
    }


    var hor = function(i,j){
        var countC = 0; countP = 0;
        for(var k=0;k<n;k++) {
            if (grid[i][k]==com) countC++;
            else if (grid[i][k]==pla) countP++;
        }
        return points(countC, countP);
    }

    var ver = function(i, j){
        var countC = 0; countP = 0;
        for(var k=0;k<n;k++) {
            if (grid[k][j]==com) countC++;
            else if (grid[k][j]==pla) countP++;
        }
        return points(countC, countP); 
    }

    var diag = function(i, j){
        if (i!=j) return 0;
        var countC = 0; countP = 0;
        for(var k=0;k<n;k++) {
            if (grid[k][k]==com) countC++;
            else if (grid[k][k]==pla) countP++;
        }
        return points(countC, countP);
    }

    var rdiag = function(i, j){
        if (i+j!=n-1) return 0;
        var countC = 0; countP = 0; 
        for(var k=0;k<n;k++) {
            if (grid[k][n-1-k]==com) countC++;
            else if (grid[k][n-1-k]==pla) countP++;
        }
        return points(countC, countP);
    }

    var mark = function(id){
        $("#" + id).css("color", "red");
    }

    var endGame = function(){
        inPlay = false;
        $(".btn").show();
    }

    var draw = function(){
        $("#text").html("Nobody wins.");
        $("#text").show();
        endGame();
    }

    var calc = function(i,j){
        var points = 0, countP = 0, countC = 0, p = 0;

        p = hor(i,j);
        if (p==6) { win(i,j,"hor"); return p}
        points += p;

        p = ver(i,j);
        if (p==6) { win(i, j,"ver"); return p}
        points +=p;

        p = diag(i,j);
        if (p==6) { win(i,j,"diag"); return p}
        points +=p;

        p = rdiag(i,j);
        if (p==6) { win(i,j,"rdiag"); return p}
        points +=p;

        return points;
    }

    var win = function(i, j, from){
        place(i*n+j);
        setTimeout(function(){
            switch(from){
                case "hor": markHor(i,j); break;
                case "ver": markVer(i,j); break;
                case "diag": markDiag(i,j); break;
                case "rdiag": markRdiag(i,j); break;
            }
            $("#gear").hide();
            $("#text").html("I win.");
            endGame();
        },1001);
    }
    
    var place = function(pos){
        $("#gear").show();
        inPlay = false;
        setTimeout(function(){
            var cur = $("#" + pos);
            grid[Math.floor(pos/n)][pos%n] = com;
            cur.text(com);
            cur.css("color", "black");
            cur.unbind('mouseover', mouseOver).unbind('mouseout', mouseOut);
            $("#gear").hide();
            $("#text").show();
            inPlay = true;
        }, 1000);
        count++;

    }
}

$(document).ready(main);
