class Army {
    constructor(yeti){

        this.camp = new Camp(yeti);

        this.soldiers = [];

        this.soldiers[0] = new Soldier(this.camp, yeti);
        this.soldiers[1] = new Soldier(this.camp, yeti);
        this.soldiers[2] = new Soldier(this.camp, yeti);

    }

    show(){
        this.camp.show();

        this.soldiers.forEach(soldier => {
            soldier.show();
        })
    }

    update(){
        this.soldiers.forEach(soldier => {
            soldier.update();
        })

    }

    collided(p){

        var result = false;
        this.soldiers.forEach(soldier => {
            if (soldier.collidedWithPlayer(p)){
                result = true;
            }
        })

        return result;

    }

    detected(p){
        var result = false;
        this.soldiers.forEach(soldier => {
            if (soldier.detected(p)){
                result = true;
            }
        })

        return result;


    }

}