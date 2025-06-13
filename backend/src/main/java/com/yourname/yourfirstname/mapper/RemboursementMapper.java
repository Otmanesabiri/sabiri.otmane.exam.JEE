package com.yourname.yourfirstname.mapper;

import com.yourname.yourfirstname.dto.RemboursementDTO;
import com.yourname.yourfirstname.entity.Remboursement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import java.util.List;

@Mapper(componentModel = "spring")
public interface RemboursementMapper {
    RemboursementMapper INSTANCE = Mappers.getMapper(RemboursementMapper.class);
    
    @Mapping(source = "credit.id", target = "creditId")
    RemboursementDTO remboursementToRemboursementDTO(Remboursement remboursement);
    
    @Mapping(target = "credit", ignore = true)
    Remboursement remboursementDTOToRemboursement(RemboursementDTO remboursementDTO);
    
    List<RemboursementDTO> remboursementsToRemboursementDTOs(List<Remboursement> remboursements);
}
