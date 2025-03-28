package palettex;

import java.sql.*;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class PalettexDB {
    private static final String DB_URL = "jdbc:sqlite:palettes.db";
    private static PalettexDB instance = null;
    private static Connection connection;

    private PalettexDB() throws SQLException {
        // Connect to db
        connection = DriverManager.getConnection(DB_URL);
        // Ensure table exists
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("CREATE TABLE IF NOT EXISTS palettes (id INTEGER PRIMARY KEY AUTOINCREMENT, blocks TEXT NOT NULL)");
        }
    }

    public static PalettexDB getInstance() throws SQLException {
        if (instance == null) {
            instance = new PalettexDB();
        }
        return instance;
    }

    public long insertPalette(List<String> blocks) throws SQLException {
        String blocksString = String.join(";", blocks);
        try (PreparedStatement pstmt = connection.prepareStatement("INSERT INTO palettes (blocks) VALUES (?)", Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setString(1, blocksString);
            pstmt.executeUpdate();
            ResultSet generatedKeys = pstmt.getGeneratedKeys();
            if (!generatedKeys.next()) throw new SQLException("Inserting palette failed: no ID obtained.");
            return generatedKeys.getLong(1);
        }
    }

    public List<String> getPalette(long paletteCode) throws SQLException {
        try (PreparedStatement pstmt = connection.prepareStatement("SELECT blocks FROM palettes WHERE id = ?")) {
            pstmt.setLong(1, paletteCode);
            ResultSet rs = pstmt.executeQuery();
            return Optional.ofNullable(rs.getString("blocks")).map(s -> Arrays.asList(s.split(";"))).orElse(null);
        }
    }

    public long getLatestPaletteId() throws SQLException {
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT id FROM palettes ORDER BY id DESC LIMIT 1" /*Get an id from palettes ordered by id descending and limited to 1*/)) {
            if (rs.next()) {
                return rs.getLong("id");
            } else {
                throw new SQLException("No palettes found.");
            }
        }
    }

}
