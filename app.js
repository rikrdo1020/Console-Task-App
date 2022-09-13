const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu,
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist
    } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

require('colors');




const main = async() => {

    let opt = ''
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if(tareasDB){
        //Establecer tareas
        tareas.cargarTareasFromArray(tareasDB);
    }
    do{
        //Imprimir el menu
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                //crear opcion
                const desc = await leerInput('Descripcion:');
                tareas.crearTarea(desc);
            break;
            case '2':
                //listar opciones
                tareas.listadoCompleto();
            break;
            
            case '3': // listar completadas
                tareas.listarPendientesCompletadas(true)
            break;
            case '4'://listar pendientes
                tareas.listarPendientesCompletadas(false)
            break;
            case '5': //completado |  pendiente
                const ids = await mostrarListadoChecklist(tareas.listadoArr);
                tareas.toggleCompletadas( ids );
            break;
            case '6':
                const id = await listadoTareasBorrar(tareas.listadoArr)
                if( id !== '0'){
                    const ok = await confirmar('Esta seguro?')
                    if ( ok ){
                        tareas.borrarTarea(id)
                        console.log('Tarea borrada')
                    }
                }
                
            break;
            default:
            break;
        }

        guardarDB( tareas.listadoArr );

        await pausa();

    } while( opt !== '0');
    
}

main();


