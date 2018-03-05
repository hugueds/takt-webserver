const PLC_CONFIG = {

    PLC_SERVER : process.env.PLC_SERVER,
    PLC_TAKT : process.env.PLC_TAKT,
    RACK : 0,
    SLOT : 2,
    MAX_INSTANCES : 24 + 1,
    
    //DBS
    DB_NUMBER : parseInt(process.env.DB_INSTANCE_NUMBER) || 8,
    DB_START : 0,
    DB_SIZE : parseInt(process.env.DB_INSTANCE_SIZE) || 162,

    //DB Ajuste
    DB_ADJUST_NUMBER : parseInt(process.env.DB_ADJUST_NUMBER) || 9,
    DB_ADJUST_SIZE : parseInt(process.env.DB_ADJUST_SIZE) || 26,
    WAGON_SIZE : 10,
    WAGON_START : 6,
    WAGON_TIMER : this.WAGON_START + 2,
    STOP_TIME : 2,

    //DB Config
    DB_CONFIG_NUMBER : parseInt(process.env.DB_CONFIG_NUMBER || 7),
    DB_CONFIG_SIZE : parseInt(process.env.DB_CONFIG_SIZE || 106),

    //DB TAKT
    DB_TAKT_NUMBER : parseInt(process.env.DB_TAKT_NUMBER) || 67,
    DB_TAKT_INSTANCE_SIZE : parseInt(process.env.DB_TAKT_INSTANCE_SIZE) || 46

};

module.exports = PLC_CONFIG;