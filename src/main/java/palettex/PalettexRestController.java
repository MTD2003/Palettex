package palettex;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@SuppressWarnings("unused")
@RestController
public class PalettexRestController implements ErrorController {

    @PostMapping("/api/createPalette")
    public CreatePaletteResponse createPalette(@RequestParam(name = "blocks") List<String> blocks) {
        try {
            PalettexDB db = PalettexDB.getInstance();
            long id = db.insertPalette(blocks);
            return CreatePaletteResponse.ofCode(id);
        } catch (SQLException e) {
            return CreatePaletteResponse.ofError("A database error occurred: " + e);
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record CreatePaletteResponse(Type type, Long code, String errorMessage) {
        public enum Type {SUCCESS, ERROR}

        public static CreatePaletteResponse ofError(String errorMessage) {
            return new CreatePaletteResponse(Type.ERROR, null, errorMessage);
        }

        public static CreatePaletteResponse ofCode(long code) {
            return new CreatePaletteResponse(Type.SUCCESS, code, null);
        }
    }

    @GetMapping("/api/getPalette/{code}")
    public GetPaletteResponse getPalette(@PathVariable(name = "code") long paletteCode) {
        try {
            PalettexDB db = PalettexDB.getInstance();
            List<String> blocks = db.getPalette(paletteCode);
            if (blocks == null) return GetPaletteResponse.ofError("Invalid code!");
            return GetPaletteResponse.ofBlocks(blocks);
        } catch (SQLException e) {
            return GetPaletteResponse.ofError("A database error occurred: " + e);
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record GetPaletteResponse(Type type, List<String> blocks, String errorMessage) {
        public enum Type {SUCCESS, ERROR}

        public static GetPaletteResponse ofError(String errorMessage) {
            return new GetPaletteResponse(Type.ERROR, null, errorMessage);
        }

        public static GetPaletteResponse ofBlocks(List<String> blocks) {
            return new GetPaletteResponse(Type.SUCCESS, blocks, null);
        }
    }

    @RequestMapping(value = "/error")
    public ResponseEntity<GenericResponse> error() {
        return ResponseEntity.badRequest().body(GenericResponse.ofError("Invalid path."));
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record GenericResponse(Type type, String errorMessage) {
        public enum Type {
            SUCCESS,
            ERROR
        }

        public static GenericResponse ofSuccess() {
            return new GenericResponse(Type.SUCCESS, null);
        }

        public static GenericResponse ofError(String errorMessage) {
            return new GenericResponse(Type.ERROR, errorMessage);
        }
    }
}
