/** @format */

import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Ticketpdf = (props) => {
  const ticketInfo = props.bookedTicket;
  console.log(ticketInfo);

  const exportPDF = () => {
    const unit = "pt";
    const size = "A3"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Your Ticket Detail ";

    const data = ticketInfo.map((ticket, index) => [
      ticket.busId.startCity,
      ticket.busId.endCity,
      new Date(ticket.busId.arrivalDate).toDateString(),
      ticket.busId.name,
      ticket.busId.description,
      ticket.busId.busNumber,
      new Date(ticket.busId.departureTiming).toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
      }),
      ticket.seatNo,
      ticket.passenger[index].name,
      ticket.passenger[index].phoneNo,
      ticket.busId.costOfticket,
    ]);

    let content = {
      startY: 50,
      head: [
        [
          "From",
          "To",
          "ArrivalDate",
          "BusName",
          "BusType",
          "BusNo",
          "DepartureTiming",
          "seatNo",
          "Passenger Name",
          "Passenger phoneNo",
          "Total Fare",
        ],
      ],
      body: data,
    };

    doc.text(title, marginLeft, 30);
    doc.autoTable(content);
    doc.save("ticket.pdf");
  };

  {
    return (
      <div>
        <button onClick={() => exportPDF()}>Generate Pdf</button>
      </div>
    );
  }
};

export default Ticketpdf;
