package ma.digitbank.jeespringangularjwtdigitalbanking.dtos;

import lombok.Data;

import java.util.List;

@Data
public class CreditHistoryDTO {
    private Long creditId;
    private double totalAmount;
    private double paidAmount;
    private double remainingAmount;
    private int currentPage;
    private int totalPages;
    private int pageSize;
    private List<RepaymentDTO> repaymentDTOS;
}
