const Board = require("../models/Board");
exports.createBoard = async (req, res) => {

    try {

        const { title, projectId } = req.body;

        const board = await Board.create({

            title,

            project: projectId

        });

        res.status(201).json({

            success: true,
            board

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
exports.getBoards = async (req, res) => {

    try {

        const boards = await Board.find({

            project: req.params.projectId

        });

        res.status(200).json({

            success: true,
            boards

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};