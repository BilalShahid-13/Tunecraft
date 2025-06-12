import { formatDateTime } from "@/lib/utils";

export const invoiceTemplate = (
  crafterUsername,
  crafterId,
  songGenre,
  musicTemplate,
  price,
  tax = 4,
  crafterEmail,
  crafterPhone,
  createdAt
) => {
  return `
    <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f8f8;">
      <main style="max-width: 800px; margin: 0 auto; padding: 20px; background-color: #fff;">
        <section style="padding: 20px; border: 1px solid #e1e1e1; margin-bottom: 20px;">
          <div style="padding: 20px; border: 1px solid #e1e1e1;">
            <table style="width: 100%; margin-bottom: 20px;">
              <tr style="background-color: #f1f1f1;">
                <td style="padding: 10px;">
                  <img src="http://www.travelerie.com/wp-content/uploads/2014/04/PlaceholderLogoBlue.jpg" alt="Tunecraft Logo" style="width: 100px;" />
                </td>
                <td style="text-align: right; padding: 10px;">
                  <h2 style="font-size: 24px; margin: 0;">Invoice</h2>
                </td>
              </tr>
              <tr style="border-top: 1px solid #e1e1e1;">
                <td style="padding: 10px;">
                  Hello, ${crafterUsername}.<br>
                  Thank you for your order with Tunecraft.
                </td>
                <td style="text-align: right; padding: 10px;">
                  <span style="font-size: 14px;">Order #${crafterId}</span><br>
                   ${formatDateTime(createdAt).date}
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="background-color: #f9f9f9;">
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Item Description</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Music Template</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Price</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">${songGenre}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${musicTemplate}</td>
                        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${price}</td>
                        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${
                          price + tax
                        }</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">Subtotal</td>
                      <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${
                        price + tax
                      }</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">Shipping & Handling</td>
                      <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$0.00</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">Tax (7%)</td>
                      <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${tax}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">Total</td>
                      <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${
                        price + tax
                      }</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <section style="margin-top: 20px;">
              <div style="display: flex; justify-content: space-between;">
                <div style="width: 48%;">
                  <h5 style="font-size: 16px; font-weight: bold;">Billing Information</h5>
                  <p style="font-size: 14px;">
                    ${crafterUsername}<br>
                    ${crafterEmail}<br>
                    ${crafterPhone}<br>
                  </p>
                </div>
                <div style="width: 48%;">
                  <h5 style="font-size: 16px; font-weight: bold;">Payment Information</h5>
                  <p style="font-size: 14px;">
                    Credit Card<br>
                    Card Type: Visa<br>
                    &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 1234
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  `;
};
