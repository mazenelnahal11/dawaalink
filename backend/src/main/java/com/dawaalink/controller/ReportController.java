package com.dawaalink.controller;

import com.dawaalink.security.SecurityContextUtil;
import com.dawaalink.service.InventoryService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final InventoryService inventoryService;
    private final SecurityContextUtil securityContext;

    public ReportController(InventoryService inventoryService, SecurityContextUtil securityContext) {
        this.inventoryService = inventoryService;
        this.securityContext = securityContext;
    }

    @GetMapping("/inventory")
    public ResponseEntity<byte[]> exportInventory() {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        
        StringBuilder csv = new StringBuilder();
        csv.append("Medicine Name,Batch Number,Expiry Date,Quantity,Unit,Unit Price (EGP)\n");
        
        inventoryService.getPharmacyInventory(pharmacyId).forEach(item -> {
            csv.append(String.format("%s,%s,%s,%d,%s,%.2f\n",
                item.getMedicineName(),
                item.getBatchNumber(),
                item.getExpiryDate(),
                item.getQuantityAvailable(),
                item.getUnit(),
                item.getUnitPrice() != null ? item.getUnitPrice() : 0.0
            ));
        });

        byte[] bytes = csv.toString().getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=inventory_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    @GetMapping("/inventory/pdf")
    public ResponseEntity<byte[]> exportInventoryPdf() {
        UUID pharmacyId = securityContext.getCurrentPharmacyId();
        
        java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
        com.itextpdf.kernel.pdf.PdfWriter writer = new com.itextpdf.kernel.pdf.PdfWriter(baos);
        com.itextpdf.kernel.pdf.PdfDocument pdf = new com.itextpdf.kernel.pdf.PdfDocument(writer);
        com.itextpdf.layout.Document document = new com.itextpdf.layout.Document(pdf);

        document.add(new com.itextpdf.layout.element.Paragraph("DawaaLink Inventory Report")
                .setBold().setFontSize(20));
        document.add(new com.itextpdf.layout.element.Paragraph("Generated on: " + java.time.LocalDateTime.now()));
        document.add(new com.itextpdf.layout.element.Paragraph("\n"));

        com.itextpdf.layout.element.Table table = new com.itextpdf.layout.element.Table(6);
        table.addCell("Medicine");
        table.addCell("Batch");
        table.addCell("Expiry");
        table.addCell("Qty");
        table.addCell("Unit");
        table.addCell("Price");

        inventoryService.getPharmacyInventory(pharmacyId).forEach(item -> {
            table.addCell(item.getMedicineName());
            table.addCell(item.getBatchNumber());
            table.addCell(item.getExpiryDate().toString());
            table.addCell(String.valueOf(item.getQuantityAvailable()));
            table.addCell(item.getUnit().name());
            table.addCell(item.getUnitPrice() != null ? String.valueOf(item.getUnitPrice()) : "0.0");
        });

        document.add(table);
        document.close();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=inventory_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(baos.toByteArray());
    }
}
