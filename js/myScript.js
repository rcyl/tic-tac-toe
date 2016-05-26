

var main = function(){

    var grid, count, n, inPlay, com, pla;

    $("#gear").hide();
    $("#text").hide();

    $("#btn-player").click(function(){
        com = 'O';
        pla = 'X';
        init();
        $("#text").fadeIn();
        $(".btn").fadeOut();
    })

    $("#btn-com").click(function(){
        com = 'X';
        pla = 'O';
        init();
        $("#text").hide();
        $(".btn").fadeOut();
        inPlay = false;
        place(initial(4));
    })

    $("td").click(function(){
        var id = this.id;  
        if (inPlay && grid[Math.floor(id/n)][id%n] == ''){
            var cur = $(this);
            fill(cur);
            //$("#text").fadeOut();
            grid[Math.floor(id/n)][id%n] = pla;
            count++;
            
            if (count==n*n) {
                draw();
                return;
            }
             $("#text").fadeOut();

            var pos = -1;
            if (count >2 ) pos = traverse(id);
            else pos = initial(id);

            if (inPlay) place(pos);

            if (count==n*n){
                draw();
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
        $("#text").html("Your turn, human.");
    }

    var initial = function(id){

        var i = Math.floor(id/n);
        var j = id%n;
        if (grid[1][1]=='') return n+1;
        if (checkCorner(i,j)) return (n-1-i)*n+(n-1-j); //return opposite corner
        if (grid[0][0] == '') return 0;
        if (grid[0][n-1] == '') return n-1;
        if (grid[n-1][0] == '') return (n-1)*n;
        return (n-1)(n+1);
    }

    var checkCorner = function(i, j){
        if (i==1 && j==1) return false;
        if (i==j) return true;
        if (i+j==n-1) return true;
    }

    var points = function(countC, countP, s, d){

        if (countC == 2 && countP == 0) return 9; //win
        if (countC == 0 && countP == 2) return 8; //block
        if (countC == 1) return 2; //chance to win
        if (d) return 3; //diagonal adjacent 
        if (s) return 1; //straight adjacent
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
        var countC = 0; countP = 0, s = false;
        for(var k=0;k<n;k++) {
            if (grid[i][k]==com) countC++;
            else if (grid[i][k]==pla) {
                countP++;
                if (Math.abs(k-j)==1) s = true;
            }
        }
        return points(countC, countP, s, false);
    }

    var ver = function(i, j){
        var countC = 0; countP = 0, s = false;
        for(var k=0;k<n;k++) {
            if (grid[k][j]==com) countC++;
            else if (grid[k][j]==pla) {
                countP++;
                if (Math.abs(k-i)==1) s = true;
            }
        }
        return points(countC, countP, s, false); 
    }

    var diag = function(i, j){
        if (i!=j) return 0;
        var countC = 0; countP = 0, d = false;
        for(var k=0;k<n;k++) {
            if (grid[k][k]==com) countC++;
            else if (grid[k][k]==pla) {
                countP++;
                if (Math.abs(k-i)==1) d = true;
            }
        }
        return points(countC, countP, false, d);
    }

    var rdiag = function(i, j){
        if (i+j!=n-1) return 0;
        var countC = 0; countP = 0, d = false; 
        for(var k=0;k<n;k++) {
            if (grid[k][n-1-k]==com) countC++;
            else if (grid[k][n-1-k]==pla) {
                countP++;
                if (Math.abs(k-i)==1) d = true;
            }
        }
        return points(countC, countP, false, d);
    }

    var mark = function(id){
        $("#" + id).css("color", "red");
    }

    var endGame = function(){
        inPlay = false;
        $(".btn").fadeIn();
    }

    var draw = function(){
        $("#text").html("Nobody wins.");
        $("#text").fadeIn();
        endGame();
    }

    var calc = function(i,j){
        var points = 0, countP = 0, countC = 0, p = 0;

        p = hor(i,j);
        if (p==9) { win(i,j,"hor"); return p}
        points += p;

        p = ver(i,j);
        if (p==9) { win(i, j,"ver"); return p}
        points +=p;

        p = diag(i,j);
        if (p==9) { win(i,j,"diag"); return p}
        points +=p;

        p = rdiag(i,j);
        if (p==9) { win(i,j,"rdiag"); return p}
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
            $("#gear").fadeOut();
            $("#text").html("I win.");
            endGame();
        },1001);
    }
    
    var place = function(pos){
        $("#gear").fadeIn();
        inPlay = false;
        setTimeout(function(){
            var cur = $("#" + pos);
            grid[Math.floor(pos/n)][pos%n] = com;
            cur.text(com);
            cur.css("color", "black");
            cur.unbind('mouseover', mouseOver).unbind('mouseout', mouseOut);
            $("#gear").fadeOut();
            $("#text").fadeIn();
            inPlay = true;
        }, 1000);
        count++;

    }
}

$(document).ready(main);
