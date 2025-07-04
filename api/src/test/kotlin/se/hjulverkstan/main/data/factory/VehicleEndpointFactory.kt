package se.hjulverkstan.main.data.factory

import se.hjulverkstan.main.data.*

object VehicleEndpointFactory {

    fun validEditVehicle(): Map<String, Any?> = mapOf(
        "regTag" to "EDITED123",
        "vehicleType" to VehicleType.BIKE,
        "imageURL" to "edited_image.jpg",
        "comment" to "Updated by test",
        "ticketIds" to listOf(10L, 11L),
        "locationId" to 1L
    )

    fun invalidEditVehicle(): Map<String, Any?> = validEditVehicle()
        .minus("vehicleType")

    fun validEditVehicleStatus(): Map<String, Any?> =
        mapOf("newStatus" to VehicleStatus.ARCHIVED)

    fun validEditStroller(id: Long = 1): Map<String, Any?> = mapOf(
        "id" to id,
        "regTag" to "STR123",
        "vehicleType" to VehicleType.STROLLER,
        "imageURL" to "updated_stroller.jpg",
        "comment" to "Updated stroller vehicle",
        "ticketIds" to listOf(12L),
        "locationId" to 1,
        "strollerType" to StrollerType.DOUBLE
    )

    fun invalidStroller(id: Long = 9999): Map<String, Any?> = validEditStroller(id)
        .plus("ticketIds" to null)

    fun validVehicle(): Map<String, Any?> = mapOf(
        "vehicleType" to VehicleType.BIKE,
        "locationId" to 1L
    )

    fun invalidVehicle(): Map<String, Any?> = validVehicle()
        .minus("vehicleType")

    fun actualValidVehicle(): Map<String, Any?> = validVehicle()
        .plus("isCustomerOwned" to false)
        .plus("regTag" to "REGTAG123")
        .plus("vehicleStatus" to VehicleStatus.AVAILABLE)

    fun validStroller(): Map<String, Any?> = mapOf(
        "vehicleType" to "STROLLER",
        "locationId" to 1,
        "strollerType" to "SINGLE"
    )

    fun actualValidStroller() = validStroller()
        .plus("isCustomerOwned" to false)
        .plus("regTag" to "AVDSRR")
        .plus("vehicleStatus" to VehicleStatus.AVAILABLE)

    fun invalidStroller() = validStroller()
        .minus("vehicleType")

    fun validBike(): Map<String, Any?> = mapOf(
        "vehicleType" to VehicleType.BIKE ,
        "locationId" to 1,
        "regTag" to "BIKE123",
        "bikeType" to BikeType.BMX,
        "gearCount" to 3,
        "size" to Size.MEDIUM,
        "brakeType" to BreakType.DISC
    )

    fun invalidBike() = validBike()
        .minus("locationId")
        .minus("regTag")

    fun invalidTakenRegTagBike() = validBike()
        .plus("regTag" to "ABC123")

    fun validBatch(): Map<String, Any?> = mapOf(
        "vehicleType" to VehicleType.BATCH,
        "locationId" to 1,
        "batchCount" to 5
    )

    fun invalidBatch(): Map<String, Any?> = validBatch()
        .minus("vehicleType")

    fun validBikeEdit(): Map<String, Any?> = mapOf(
        "vehicleType" to VehicleType.BIKE,
        "locationId" to 1,
        "bikeType" to BikeType.ROAD,
        "gearCount" to 3,
        "size" to Size.MEDIUM,
        "brakeType" to BreakType.DISC
    )

    fun invalidBikeEdit(): Map<String, Any?> = validBikeEdit()
        .minus("vehicleType")

    fun validBatchEdit(): Map<String, Any?> = mapOf(
        "vehicleType" to VehicleType.BATCH,
        "locationId" to 1,
        "batchCount" to 5
    )

    fun invalidBatchEdit(): Map<String, Any?> = validBatchEdit()
        .minus("vehicleType")


}