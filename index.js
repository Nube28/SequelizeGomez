const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('libreria', 'root', '1234', {
    host: 'localhost', 
    dialect: 'mysql'
});

const Autor = sequelize.define('Autor',{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    biografia: {
        type: DataTypes.TEXT,
        allowNull: true
    }

});

const Libro = sequelize.define('Libro', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isbn: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [13, 13],
        }
    },
});

const Editorial = sequelize.define('Editorial', {
    nombre: {
        type: DataTypes.STRING,
        allowNull:false
    },
});

Autor.hasMany(Libro);
Libro.belongsTo(Autor);

Editorial.hasMany(Libro);
Libro.belongsTo(Editorial);

/*
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Modelos sincronizados con la base de datos.');
    })
    .catch((error) => {
        console.log('Error al sincronizar modelos:', error);
    });
*/

async function prueba() {
    await sequelize.sync({ alter: true });

    const editorial = await Editorial.create({ nombre: 'Editorial Perrona' });
    const autor = await Autor.create({ nombre: 'Ava Dellaira' });

    await crearLibro('Carta de amor a los muertos', '1234567890123', autor.id, editorial.id);

    let libros = await leerLibros();
    console.log(libros);

    await actualizarLibro(1, { titulo: 'Carta de amor a los vivos' });
    libros = await leerLibros();
    console.log(libros);

    await eliminarLibro(1);
    libros = await leerLibros();
    console.log(libros);
}

prueba();

async function crearLibro(titulo, isbn, autorId, editorialId) {
    try {
        const libro = await Libro.create({
            titulo,
            isbn,
            AutorId: autorId,
            EditorialId: editorialId
        });
    } catch (error) {
        console.error('Error al crear libro:', error);
    }
}

async function leerLibros() {
    try {
        const libros = await Libro.findAll({
            include: [Autor, Editorial]
        });
        return JSON.stringify(libros, null, 2);
    } catch (error) {
        console.error('Error al leer libros:', error);
    }
}

async function eliminarLibro(id) {
    try {
        const libro = await Libro.findByPk(id);
        await libro.destroy();
        console.log('Libro eliminado');
    } catch (error) {
        console.error('Error al eliminar libro:', error);
    }
}

async function actualizarLibro(id, nuevosDatos) {
    try {
        const libro = await Libro.findByPk(id);
        await libro.update(nuevosDatos);
        console.log('Libro actualizado:', libro.toJSON());
    } catch (error) {
        console.error('Error al actualizar libro:', error);
    }
}