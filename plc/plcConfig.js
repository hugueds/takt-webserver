const PLC_CONFIG = {

    PLC_SERVER : process.env.PLC_SERVER || '10.8.66.82',
    PLC_TAKT : process.env.PLC_TAKT || '10.8.66.8' ,
    PLC_RACK : parseInt(process.env.PLC_RACK) || 0,
    PLC_SLOT : parseInt(process.env.PLC_SLOT) || 2,
    MAX_INSTANCES : parseInt(process.env.MAX_INSTANCES) || 24 + 1,
    
    // DBS
    DB_NUMBER : parseInt(process.env.DB_INSTANCE_NUMBER) || 8,
    DB_START : 0,
    DB_SIZE : parseInt(process.env.DB_INSTANCE_SIZE) || 162,

    // DB Ajuste
    DB_ADJUST_NUMBER : parseInt(process.env.DB_ADJUST_NUMBER) || 9,
    DB_ADJUST_SIZE : parseInt(process.env.DB_ADJUST_SIZE) || 26,
    WAGON_SIZE : 10,
    WAGON_START : 6,
    WAGON_TIMER : 8,
    STOP_TIME : 2,

    // DB Config
    DB_CONFIG_NUMBER : parseInt(process.env.DB_CONFIG_NUMBER || 7),
    DB_CONFIG_SIZE : parseInt(process.env.DB_CONFIG_SIZE || 106),

    // DB TAKT
    DB_TAKT_NUMBER : parseInt(process.env.DB_TAKT_NUMBER) || 67,
    DB_TAKT_INSTANCE_SIZE : parseInt(process.env.DB_TAKT_INSTANCE_SIZE) || 46,

    // DB Andon
    DB_ANDON : parseInt(process.env.DB_ANDON) || 43,
    DB_ANDON_SIZE : parseInt(process.env.DB_ANDON_SIZE) || 4

};

module.exports = PLC_CONFIG;